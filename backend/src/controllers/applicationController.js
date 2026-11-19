const db = require('../config/db');

const VALID_STATUSES = ['submitted', 'reviewing', 'approved', 'rejected'];

// POST /api/v1/adoption-applications (ส่งใบสมัครขอรับเลี้ยง - 201 Created)
// รองรับทั้ง Adopter, Caretaker คนอื่น (ที่อยากรับเลี้ยงสัตว์ตัวนั้น)
async function submitApplication(req, res, next) {
  try {
    const applicantId = req.user.id;
    const { animal_id, animalId, reason, home_environment, homeEnvironment } = req.body;
    const finalAnimalId = animal_id || animalId;

    if (!finalAnimalId || isNaN(Number(finalAnimalId))) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid animal_id is required.' },
      });
    }

    const animalCheck = await db.query('SELECT * FROM animals WHERE id = $1', [Number(finalAnimalId)]);
    if (animalCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Animal with ID ${finalAnimalId} not found.` },
      });
    }

    const animal = animalCheck.rows[0];
    if (animal.status === 'adopted') {
      return res.status(400).json({
        success: false,
        error: { message: 'สัตว์ตัวนี้ได้รับการรับเลี้ยงไปแล้ว' },
      });
    }

    // 🌟 ห้ามส่งใบสมัครขอรับเลี้ยงสัตว์ที่ตัวเองเป็นคนดูแลอยู่
    if (animal.caretaker_id === applicantId) {
      return res.status(400).json({
        success: false,
        error: { message: 'คุณเป็นผู้ดูแลสัตว์ตัวนี้อยู่แล้ว ไม่สามารถส่งใบสมัครขอรับเลี้ยงสัตว์ของตัวเองได้' },
      });
    }

    const finalReason = reason ? reason.trim() : null;
    const finalHomeEnv = home_environment || homeEnvironment ? (home_environment || homeEnvironment).trim() : null;

    // 🌟 ถ้าสัตว์ตัวนี้ไม่มีผู้ดูแล (เช่น โพสต์โดย Guest หรือสัตว์ข้างทาง):
    // ไม่ต้องรอคนอนุมัติ! ปรับสถานะเป็น 'approved' ทันที และปรับสัตว์เป็น 'adopted'
    const isGuestAnimal = !animal.caretaker_id;
    const initialStatus = isGuestAnimal ? 'approved' : 'submitted';

    const result = await db.query(
      `INSERT INTO adoption_applications (animal_id, applicant_id, reason, home_environment, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [Number(finalAnimalId), applicantId, finalReason, finalHomeEnv, initialStatus]
    );

    if (isGuestAnimal) {
      await db.query(`UPDATE animals SET status = 'adopted' WHERE id = $1`, [Number(finalAnimalId)]);
      // ปฏิเสธใบสมัครอื่นของสัตว์ตัวนี้ (ถ้ามี)
      await db.query(
        `UPDATE adoption_applications 
         SET status = 'rejected' 
         WHERE animal_id = $1 AND id != $2 AND status IN ('submitted', 'reviewing')`,
        [Number(finalAnimalId), result.rows[0].id]
      );
    }

    return res.status(201).json({
      success: true,
      message: isGuestAnimal 
        ? 'รับเลี้ยงสัตว์เรียบร้อยแล้ว (สัตว์จาก Guest อนุมัติทันทีไม่ต้องรอการพิจารณา)' 
        : 'Adoption application submitted successfully',
      data: result.rows[0],
      autoApproved: isGuestAnimal,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/adoption-applications/me (ดึงรายการใบสมัคร)
// - Admin: เห็นใบสมัครทั้งหมด
// - Caretaker: เห็นเฉพาะใบสมัครของสัตว์ที่ตัวเองเป็นคนดูแล (caretaker_id = user.id) รวมกับใบสมัครที่ตัวเองยื่นขอรับเลี้ยง (applicant_id = user.id)
// - Adopter: เห็นเฉพาะใบสมัครที่ตัวเองเป็นคนส่ง (applicant_id = user.id)
async function getMyApplications(req, res, next) {
  try {
    const user = req.user;
    let queryText = '';
    let params = [];

    if (user.role === 'admin') {
      queryText = `
        SELECT 
          app.*,
          a.name as animal_name,
          a.species as animal_species,
          a.breed as animal_breed,
          a.photo_url as animal_photo_url,
          a.status as animal_status,
          a.caretaker_id,
          u.name as applicant_name,
          u.phone as applicant_phone,
          u.email as applicant_email,
          cu.name as caretaker_name
        FROM adoption_applications app
        JOIN animals a ON app.animal_id = a.id
        JOIN users u ON app.applicant_id = u.id
        LEFT JOIN users cu ON a.caretaker_id = cu.id
        ORDER BY app.submitted_at DESC
      `;
    } else if (user.role === 'caretaker') {
      // Caretaker เห็น:
      // 1. ใบสมัครที่คนอื่นส่งเข้ามาหาสัตว์ของตนเอง (a.caretaker_id = user.id) เพื่อใช้พิจารณา
      // 2. ใบสมัครที่ตนเองส่งไปขอรับเลี้ยงสัตว์ของคนอื่น (app.applicant_id = user.id)
      queryText = `
        SELECT 
          app.*,
          a.name as animal_name,
          a.species as animal_species,
          a.breed as animal_breed,
          a.photo_url as animal_photo_url,
          a.status as animal_status,
          a.caretaker_id,
          u.name as applicant_name,
          u.phone as applicant_phone,
          u.email as applicant_email,
          cu.name as caretaker_name
        FROM adoption_applications app
        JOIN animals a ON app.animal_id = a.id
        JOIN users u ON app.applicant_id = u.id
        LEFT JOIN users cu ON a.caretaker_id = cu.id
        WHERE a.caretaker_id = $1 OR app.applicant_id = $1
        ORDER BY app.submitted_at DESC
      `;
      params.push(user.id);
    } else {
      queryText = `
        SELECT 
          app.*,
          a.name as animal_name,
          a.species as animal_species,
          a.breed as animal_breed,
          a.photo_url as animal_photo_url,
          a.status as animal_status,
          a.caretaker_id,
          u.name as applicant_name,
          u.phone as applicant_phone,
          u.email as applicant_email,
          cu.name as caretaker_name
        FROM adoption_applications app
        JOIN animals a ON app.animal_id = a.id
        JOIN users u ON app.applicant_id = u.id
        LEFT JOIN users cu ON a.caretaker_id = cu.id
        WHERE app.applicant_id = $1
        ORDER BY app.submitted_at DESC
      `;
      params.push(user.id);
    }

    const result = await db.query(queryText, params);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/adoption-applications/:id/status (อนุมัติ/ปฏิเสธใบสมัคร)
async function updateApplicationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid application ID format.' },
      });
    }

    if (!status || !VALID_STATUSES.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}` },
      });
    }

    const normalizedStatus = status.toLowerCase();

    const appCheck = await db.query(
      `SELECT app.*, a.caretaker_id 
       FROM adoption_applications app
       JOIN animals a ON app.animal_id = a.id
       WHERE app.id = $1`,
      [Number(id)]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Adoption application with ID ${id} not found.` },
      });
    }

    const application = appCheck.rows[0];

    // Caretaker permission check: only caretaker of this animal or admin can approve/reject
    if (user.role !== 'admin' && application.caretaker_id !== user.id) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'คุณไม่มีสิทธิ์อนุมัติใบสมัครนี้ เนื่องจากคุณไม่ได้เป็นผู้ดูแลสัตว์ตัวนี้ (สงวนสิทธิ์เฉพาะผู้ดูแลสัตว์ตัวนี้ หรือ Admin)',
        },
      });
    }

    const updateResult = await db.query(
      `UPDATE adoption_applications 
       SET status = $1 
       WHERE id = $2 
       RETURNING *`,
      [normalizedStatus, Number(id)]
    );

    if (normalizedStatus === 'approved') {
      // 1. ปรับสถานะสัตว์เป็น 'adopted'
      await db.query(
        `UPDATE animals SET status = 'adopted' WHERE id = $1`,
        [application.animal_id]
      );

      // 2. ปฏิเสธ (reject) ใบสมัครคนอื่นๆ ทั้งหมดของสัตว์ตัวนี้ที่ยังค้างอยู่
      await db.query(
        `UPDATE adoption_applications 
         SET status = 'rejected' 
         WHERE animal_id = $1 AND id != $2 AND status IN ('submitted', 'reviewing')`,
        [application.animal_id, Number(id)]
      );
    }

    return res.status(200).json({
      success: true,
      message: `Adoption application status updated to ${normalizedStatus}`,
      data: updateResult.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  submitApplication,
  getMyApplications,
  updateApplicationStatus,
};

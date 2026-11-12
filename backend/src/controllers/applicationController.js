const db = require('../config/db');

const VALID_STATUSES = ['submitted', 'reviewing', 'approved', 'rejected'];

// POST /api/v1/adoption-applications (ส่งใบสมัครขอรับเลี้ยง - 201 Created - Adopter)
async function submitApplication(req, res, next) {
  try {
    const applicantId = req.user.id;
    const { animal_id, reason, home_environment } = req.body;

    if (!animal_id) {
      return res.status(400).json({
        success: false,
        error: { message: 'animal_id is required.' },
      });
    }

    // ตรวจสอบว่ามีสัตว์ตัวนี้อยู่จริงหรือไม่
    const animalCheck = await db.query('SELECT id, status FROM animals WHERE id = $1', [Number(animal_id)]);
    if (animalCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Animal with ID ${animal_id} not found.` },
      });
    }

    const insertResult = await db.query(
      `INSERT INTO adoption_applications (animal_id, applicant_id, reason, home_environment, status)
       VALUES ($1, $2, $3, $4, 'submitted')
       RETURNING *`,
      [
        Number(animal_id),
        applicantId,
        reason ? reason.trim() : null,
        home_environment ? home_environment.trim() : null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Adoption application submitted successfully',
      data: insertResult.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/adoption-applications/me (ดูสถานะใบสมัครของตัวเอง - 200 OK - Adopter)
async function getMyApplications(req, res, next) {
  try {
    const applicantId = req.user.id;

    const queryText = `
      SELECT 
        app.*,
        a.name as animal_name,
        a.species as animal_species,
        a.breed as animal_breed,
        a.photo_url as animal_photo_url,
        a.status as animal_status
      FROM adoption_applications app
      JOIN animals a ON app.animal_id = a.id
      WHERE app.applicant_id = $1
      ORDER BY app.submitted_at DESC
    `;

    const result = await db.query(queryText, [applicantId]);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/adoption-applications/:id/status (อนุมัติ/ปฏิเสธใบสมัคร - 200 OK - Caretaker)
async function updateApplicationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

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

    // ค้นหาใบสมัคร
    const existing = await db.query(
      'SELECT * FROM adoption_applications WHERE id = $1',
      [Number(id)]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Application with ID ${id} not found.` },
      });
    }

    const appData = existing.rows[0];

    // อัปเดตสถานะใบสมัคร
    const updateResult = await db.query(
      `UPDATE adoption_applications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [normalizedStatus, Number(id)]
    );

    // ถ้าอนุมัติ (approved) ให้อัปเดตสัตว์ตัวนั้นเป็น 'adopted' ด้วยเพื่อความสมบูรณ์
    if (normalizedStatus === 'approved') {
      await db.query(
        `UPDATE animals SET status = 'adopted' WHERE id = $1`,
        [appData.animal_id]
      );
    }

    return res.status(200).json({
      success: true,
      message: `Application status updated to ${normalizedStatus}`,
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


const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary } = require('./uploadController');
const { CLOUDINARY } = require('../config/env');

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// POST /api/v1/pet-updates (ผู้รับเลี้ยง อัปเดตรูปถ่าย / วิดีโอ พร้อมข้อความ)
async function createPetUpdate(req, res, next) {
  try {
    const userId = req.user.id;
    const { application_id, applicationId, caption, media_url, media_type } = req.body;
    const finalAppId = application_id || applicationId;

    if (!finalAppId || isNaN(Number(finalAppId))) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid application_id is required.' },
      });
    }

    // ตรวจสอบใบสมัคร: ต้องมีอยู่จริง ได้รับอนุมัติแล้ว และผู้ส่งต้องเป็นผู้ขอรับเลี้ยง (applicant) หรือ admin
    const appCheck = await db.query(
      `SELECT app.id, app.applicant_id, app.status, a.name as animal_name, a.caretaker_id
       FROM adoption_applications app
       JOIN animals a ON app.animal_id = a.id
       WHERE app.id = $1`,
      [Number(finalAppId)]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Adoption application with ID ${finalAppId} not found.` },
      });
    }

    const appData = appCheck.rows[0];

    // ตรวจสอบสิทธิ์: ผู้รับเลี้ยงตัวจริง หรือ admin
    if (req.user.role !== 'admin' && appData.applicant_id !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'คุณไม่มีสิทธิ์ส่งอัปเดตสำหรับใบสมัครนี้ (เฉพาะผู้รับเลี้ยงเท่านั้น)' },
      });
    }

    if (appData.status !== 'approved') {
      return res.status(400).json({
        success: false,
        error: { message: 'สามารถส่งอัปเดตได้เฉพาะใบสมัครที่ได้รับอนุมัติ (approved) แล้วเท่านั้น' },
      });
    }

    if (!appData.caretaker_id) {
      return res.status(400).json({
        success: false,
        error: { message: 'สัตว์ที่รับมาจากบุคคลภายนอก (Guest) ไม่มีผู้ดูแล ไม่จำเป็นต้องส่งอัปเดตสัตว์เลี้ยง' },
      });
    }

    let finalMediaUrl = media_url ? media_url.trim() : '';
    let finalMediaType = media_type || 'image';

    // หากมีการอัปโหลดไฟล์ (ผ่าน multer multipart/form-data)
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video/');
      finalMediaType = isVideo ? 'video' : 'image';

      if (CLOUDINARY && CLOUDINARY.cloud_name && CLOUDINARY.api_key && CLOUDINARY.api_secret) {
        try {
          const uploadResult = await uploadToCloudinary(req.file.buffer, 'adopt-me/pet-updates');
          finalMediaUrl = uploadResult.secure_url;
        } catch (uploadErr) {
          console.error('[Cloudinary Upload Error]', uploadErr.message);
          // Fallback to local save
          const ext = path.extname(req.file.originalname) || (isVideo ? '.mp4' : '.jpg');
          const filename = `update-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          const filePath = path.join(uploadDir, filename);
          fs.writeFileSync(filePath, req.file.buffer);
          finalMediaUrl = `http://localhost:5000/uploads/${filename}`;
        }
      } else {
        const ext = path.extname(req.file.originalname) || (isVideo ? '.mp4' : '.jpg');
        const filename = `update-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, req.file.buffer);
        finalMediaUrl = `http://localhost:5000/uploads/${filename}`;
      }
    }

    if (!finalMediaUrl) {
      return res.status(400).json({
        success: false,
        error: { message: 'กรุณาแนบรูปภาพ/วิดีโอ หรือระบุ media_url' },
      });
    }

    // บันทึกลง database
    const insertRes = await db.query(
      `INSERT INTO pet_updates (application_id, adopter_id, media_url, media_type, caption)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [Number(finalAppId), userId, finalMediaUrl, finalMediaType, caption ? caption.trim() : null]
    );

    return res.status(201).json({
      success: true,
      message: 'อัปเดตน้องจากบ้านใหม่ส่งถึงผู้ดูแลเรียบร้อยแล้ว!',
      data: insertRes.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/pet-updates (ดึงรายการอัปเดต ทั้งหมด หรือตาม application_id)
async function getPetUpdates(req, res, next) {
  try {
    const { application_id } = req.query;
    let queryText = `
      SELECT 
        pu.*,
        adopter.name AS adopter_name,
        adopter.email AS adopter_email,
        caretaker.name AS feedback_by_name,
        a.id AS animal_id,
        a.name AS animal_name,
        a.photo_url AS animal_photo_url,
        a.caretaker_id
      FROM pet_updates pu
      JOIN users adopter ON pu.adopter_id = adopter.id
      JOIN adoption_applications app ON pu.application_id = app.id
      JOIN animals a ON app.animal_id = a.id
      LEFT JOIN users caretaker ON pu.feedback_by = caretaker.id
    `;
    const params = [];

    if (application_id) {
      params.push(Number(application_id));
      queryText += ' WHERE pu.application_id = $1';
    }

    queryText += ' ORDER BY pu.created_at DESC, pu.id DESC';

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

// PATCH /api/v1/pet-updates/:id/feedback (Caretaker พิมพ์ Feedback / คำแนะนำในการเลี้ยงดู)
async function giveFeedback(req, res, next) {
  try {
    const updateId = req.params.id;
    const caretakerId = req.user.id;
    const { feedback } = req.body;

    if (!updateId || isNaN(Number(updateId))) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid update ID is required.' },
      });
    }

    if (!feedback || !feedback.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'กรุณากรอกข้อความ Feedback / คำแนะนำ' },
      });
    }

    // ตรวจสอบ pet_update และสิทธิ์ของ Caretaker
    const updateCheck = await db.query(
      `SELECT pu.id, a.caretaker_id
       FROM pet_updates pu
       JOIN adoption_applications app ON pu.application_id = app.id
       JOIN animals a ON app.animal_id = a.id
       WHERE pu.id = $1`,
      [Number(updateId)]
    );

    if (updateCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Pet update with ID ${updateId} not found.` },
      });
    }

    const petUp = updateCheck.rows[0];

    // เฉพาะ Caretaker เจ้าของสัตว์ หรือ Admin เท่านั้นที่สามารถให้ feedback ได้
    if (req.user.role !== 'admin' && petUp.caretaker_id !== caretakerId) {
      return res.status(403).json({
        success: false,
        error: { message: 'คุณไม่มีสิทธิ์ให้ข้อเสนอแนะสำหรับการอัปเดตของสัตว์ตัวนี้ (เฉพาะ Caretaker ผู้ดูแลสัตว์เท่านั้น)' },
      });
    }

    const updated = await db.query(
      `UPDATE pet_updates
       SET feedback = $1, feedback_by = $2, feedback_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [feedback.trim(), caretakerId, Number(updateId)]
    );

    return res.status(200).json({
      success: true,
      message: 'บันทึก Feedback / คำแนะนำในการเลี้ยงดูเรียบร้อยแล้ว',
      data: updated.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPetUpdate,
  getPetUpdates,
  giveFeedback,
};

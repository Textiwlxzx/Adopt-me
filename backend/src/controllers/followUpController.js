const db = require('../config/db');

const VALID_STATUSES = ['good', 'needs_attention'];

// POST /api/v1/follow-ups (บันทึกผลการติดตามหลังรับเลี้ยง - 201 Created - Caretaker)
async function createFollowUp(req, res, next) {
  try {
    const caretakerId = req.user.id;
    const { application_id, visit_date, note, status } = req.body;

    if (!application_id || !visit_date) {
      return res.status(400).json({
        success: false,
        error: { message: 'application_id and visit_date are required.' },
      });
    }

    // ตรวจสอบว่ามีใบสมัครนี้อยู่จริงหรือไม่
    const appCheck = await db.query(
      'SELECT id FROM adoption_applications WHERE id = $1',
      [Number(application_id)]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Adoption application with ID ${application_id} not found.` },
      });
    }

    const normalizedStatus = (status || 'good').toLowerCase();
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}` },
      });
    }

    const insertResult = await db.query(
      `INSERT INTO follow_ups (application_id, visit_date, note, status, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        Number(application_id),
        visit_date,
        note ? note.trim() : null,
        normalizedStatus,
        caretakerId,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Follow-up created successfully',
      data: insertResult.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createFollowUp,
};


const db = require('../config/db');

const VALID_FOLLOW_UP_STATUSES = ['good', 'needs_attention'];

// POST /api/v1/follow-ups (บันทึกผลการติดตามหลังรับเลี้ยง - Caretaker - 201 Created)
async function createFollowUp(req, res, next) {
  try {
    const caretakerId = req.user.id;
    const {
      application_id,
      applicationId,
      visit_date,
      visitDate,
      note,
      status,
    } = req.body;

    const finalAppId = application_id || applicationId;
    const finalVisitDate = visit_date || visitDate;
    const finalStatus = (status || 'good').toLowerCase();

    if (!finalAppId || isNaN(Number(finalAppId))) {
      return res.status(400).json({
        success: false,
        error: { message: 'Valid application_id is required.' },
      });
    }

    if (!finalVisitDate) {
      return res.status(400).json({
        success: false,
        error: { message: 'visit_date is required (format: YYYY-MM-DD).' },
      });
    }

    if (!VALID_FOLLOW_UP_STATUSES.includes(finalStatus)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid status. Allowed values: ${VALID_FOLLOW_UP_STATUSES.join(', ')}`,
        },
      });
    }

    // Check application exists
    const appCheck = await db.query(
      'SELECT id, animal_id, applicant_id, status FROM adoption_applications WHERE id = $1',
      [Number(finalAppId)]
    );

    if (appCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Adoption application with ID ${finalAppId} not found.` },
      });
    }

    const finalNote = note ? note.trim() : null;

    const result = await db.query(
      `INSERT INTO follow_ups (application_id, visit_date, note, status, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [Number(finalAppId), finalVisitDate, finalNote, finalStatus, caretakerId]
    );

    return res.status(201).json({
      success: true,
      message: 'Follow-up record created successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/follow-ups (ดึงรายการ follow-ups ทั้งหมดหรือตาม application_id)
async function getFollowUps(req, res, next) {
  try {
    const { application_id } = req.query;
    let queryText = `
      SELECT 
        f.*,
        u.name as caretaker_name,
        a.animal_id,
        anim.name as animal_name,
        adopter.name as adopter_name
      FROM follow_ups f
      LEFT JOIN users u ON f.created_by = u.id
      JOIN adoption_applications a ON f.application_id = a.id
      JOIN animals anim ON a.animal_id = anim.id
      JOIN users adopter ON a.applicant_id = adopter.id
    `;
    const params = [];

    if (application_id) {
      params.push(Number(application_id));
      queryText += ' WHERE f.application_id = $1';
    }

    queryText += ' ORDER BY f.visit_date DESC, f.id DESC';

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

module.exports = {
  createFollowUp,
  getFollowUps,
};

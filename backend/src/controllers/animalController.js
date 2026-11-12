const db = require('../config/db');

const VALID_SPECIES = ['dog', 'cat', 'other'];
const VALID_GENDERS = ['male', 'female'];
const VALID_STATUSES = ['street', 'fostered', 'adopted'];

// POST /api/v1/animals (แจ้ง/ลงทะเบียนสัตว์ที่พบใหม่ - 201 Created)
async function createAnimal(req, res, next) {
  try {
    const {
      name,
      species,
      breed,
      age,
      gender,
      health_condition,
      healthCondition,
      personality_note,
      personalityNote,
      photo_url,
      photoUrl,
      image_url,
      imageUrl,
      location_found,
      locationFound,
      location,
      status,
      caretaker_id,
      caretakerId,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: { message: 'Animal name is required.' },
      });
    }

    // Validate and normalize species ENUM ('dog', 'cat', 'other')
    const normalizedSpecies = (species || 'other').toLowerCase();
    if (!VALID_SPECIES.includes(normalizedSpecies)) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid species. Allowed values: ${VALID_SPECIES.join(', ')}` },
      });
    }

    // Validate gender ENUM ('male', 'female', nullable)
    let normalizedGender = null;
    if (gender) {
      const g = gender.toLowerCase();
      if (!VALID_GENDERS.includes(g)) {
        return res.status(400).json({
          success: false,
          error: { message: `Invalid gender. Allowed values: ${VALID_GENDERS.join(', ')}` },
        });
      }
      normalizedGender = g;
    }

    // Validate status ENUM ('street', 'fostered', 'adopted')
    const normalizedStatus = (status || 'street').toLowerCase();
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}` },
      });
    }

    // Parse age (INT)
    let parsedAge = null;
    if (age !== undefined && age !== null && age !== '') {
      const num = parseInt(age, 10);
      if (!isNaN(num)) {
        parsedAge = num;
      }
    }

    const finalPhotoUrl = photo_url || photoUrl || image_url || imageUrl || null;
    const finalLocationFound = location_found || locationFound || location || null;
    const finalHealthCondition = health_condition || healthCondition || null;
    const finalPersonalityNote = personality_note || personalityNote || null;
    const finalCaretakerId = caretaker_id || caretakerId || null;

    const result = await db.query(
      `INSERT INTO animals (
        caretaker_id, name, species, breed, age, gender,
        health_condition, personality_note, photo_url, location_found, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        finalCaretakerId,
        name.trim(),
        normalizedSpecies,
        breed ? breed.trim() : null,
        parsedAge,
        normalizedGender,
        finalHealthCondition ? finalHealthCondition.trim() : null,
        finalPersonalityNote ? finalPersonalityNote.trim() : null,
        finalPhotoUrl,
        finalLocationFound ? finalLocationFound.trim() : null,
        normalizedStatus,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Animal registered successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/animals (ดึงรายการสัตว์ทั้งหมด - 200 OK)
async function getAllAnimals(req, res, next) {
  try {
    const { species, status, gender, search, limit = 50, offset = 0 } = req.query;

    let queryText = `
      SELECT 
        a.*,
        u.name as caretaker_name,
        u.phone as caretaker_phone
      FROM animals a
      LEFT JOIN users u ON a.caretaker_id = u.id
    `;
    const queryParams = [];
    const conditions = [];

    if (species && VALID_SPECIES.includes(species.toLowerCase())) {
      queryParams.push(species.toLowerCase());
      conditions.push(`a.species = $${queryParams.length}`);
    }

    if (status && VALID_STATUSES.includes(status.toLowerCase())) {
      queryParams.push(status.toLowerCase());
      conditions.push(`a.status = $${queryParams.length}`);
    }

    if (gender && VALID_GENDERS.includes(gender.toLowerCase())) {
      queryParams.push(gender.toLowerCase());
      conditions.push(`a.gender = $${queryParams.length}`);
    }

    if (search) {
      queryParams.push(`%${search.toLowerCase()}%`);
      const paramIndex = queryParams.length;
      conditions.push(`(
        LOWER(a.name) LIKE $${paramIndex} OR
        LOWER(COALESCE(a.breed, '')) LIKE $${paramIndex} OR
        LOWER(COALESCE(a.location_found, '')) LIKE $${paramIndex} OR
        LOWER(COALESCE(a.personality_note, '')) LIKE $${paramIndex}
      )`);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY a.created_at DESC';

    // Pagination
    queryParams.push(parseInt(limit, 10) || 50);
    queryText += ` LIMIT $${queryParams.length}`;

    queryParams.push(parseInt(offset, 10) || 0);
    queryText += ` OFFSET $${queryParams.length}`;

    const result = await db.query(queryText, queryParams);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/animals/:id (ดูรายละเอียดสัตว์แต่ละตัว - 200 OK)
async function getAnimalById(req, res, next) {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid animal ID format.' },
      });
    }

    const queryText = `
      SELECT 
        a.*,
        u.name as caretaker_name,
        u.email as caretaker_email,
        u.phone as caretaker_phone
      FROM animals a
      LEFT JOIN users u ON a.caretaker_id = u.id
      WHERE a.id = $1
    `;

    const result = await db.query(queryText, [Number(id)]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Animal with ID ${id} not found.` },
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/v1/animals/:id/claim (รับเป็นคนดูแล (claim) สัตว์ตัวนี้ - 200 OK - Caretaker)
async function claimAnimal(req, res, next) {
  try {
    const { id } = req.params;
    const caretakerId = req.user.id;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid animal ID format.' },
      });
    }

    // ตรวจสอบว่ามีสัตว์ตัวนี้ในระบบหรือไม่
    const existing = await db.query('SELECT * FROM animals WHERE id = $1', [Number(id)]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Animal with ID ${id} not found.` },
      });
    }

    // อัปเดต caretaker_id และปรับสถานะเป็น 'fostered'
    const result = await db.query(
      `UPDATE animals
       SET caretaker_id = $1, status = 'fostered'
       WHERE id = $2
       RETURNING *`,
      [caretakerId, Number(id)]
    );

    return res.status(200).json({
      success: true,
      message: 'Claimed animal successfully',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createAnimal,
  getAllAnimals,
  getAnimalById,
  claimAnimal,
};

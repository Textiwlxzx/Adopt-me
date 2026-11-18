const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { uploadToCloudinary } = require('./uploadController');
const { CLOUDINARY } = require('../config/env');

const VALID_SPECIES = ['dog', 'cat', 'other'];
const VALID_GENDERS = ['male', 'female'];
const VALID_STATUSES = ['street', 'fostered', 'adopted'];

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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

    if (!name) {
      return res.status(400).json({
        success: false,
        error: { message: 'Animal name is required.' },
      });
    }

    const normalizedSpecies = (species || 'other').toLowerCase();
    if (!VALID_SPECIES.includes(normalizedSpecies)) {
      return res.status(400).json({
        success: false,
        error: { message: `Invalid species. Allowed values: ${VALID_SPECIES.join(', ')}` },
      });
    }

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

    let parsedAge = null;
    if (age !== undefined && age !== null && age !== '') {
      const num = parseInt(age, 10);
      if (!isNaN(num)) {
        parsedAge = num;
      }
    }

    // Determine photo urls (supports single or multiple):
    let uploadedUrls = [];

    // Check files uploaded via multer
    const filesToUpload = [];
    if (req.files) {
      if (req.files.image && req.files.image.length > 0) {
        filesToUpload.push(...req.files.image);
      }
      if (req.files.images && req.files.images.length > 0) {
        filesToUpload.push(...req.files.images);
      }
    } else if (req.file) {
      filesToUpload.push(req.file);
    }

    if (filesToUpload.length > 0) {
      for (const file of filesToUpload) {
        if (CLOUDINARY && CLOUDINARY.cloud_name && CLOUDINARY.api_key && CLOUDINARY.api_secret) {
          try {
            const uploadResult = await uploadToCloudinary(file.buffer, 'adopt-me/animals');
            uploadedUrls.push(uploadResult.secure_url);
          } catch (uploadErr) {
            console.error('[Cloudinary Upload Error]', uploadErr.message);
            // Fallback to local if Cloudinary fails
            const ext = path.extname(file.originalname) || '.jpg';
            const filename = `animal-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, file.buffer);
            uploadedUrls.push(`http://localhost:5000/uploads/${filename}`);
          }
        } else {
          const ext = path.extname(file.originalname) || '.jpg';
          const filename = `animal-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          const filePath = path.join(uploadDir, filename);
          fs.writeFileSync(filePath, file.buffer);
          uploadedUrls.push(`http://localhost:5000/uploads/${filename}`);
        }
      }
    }

    // Also check if URLs were provided in body
    const initialPhotoUrl = photo_url || photoUrl || image_url || imageUrl || null;
    if (initialPhotoUrl && uploadedUrls.length === 0) {
      uploadedUrls.push(initialPhotoUrl);
    }

    const finalPhotoUrl = uploadedUrls[0] || null;
    const finalPhotos = uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : null;

    const finalLocationFound = location_found || locationFound || location || null;
    const finalHealthCondition = health_condition || healthCondition || null;
    const finalPersonalityNote = personality_note || personalityNote || null;

    // 🌟 ตรวจสอบผู้สร้าง:
    // ถ้า Caretaker เป็นคนประกาศ: ตั้งตัวเองเป็น caretaker_id และสถานะเป็น fostered (พร้อมรับเลี้ยง)
    // ถ้า Guest หรือ Adopter ประกาศ: caretaker_id = null และสถานะเป็น street (รอผู้ดูแล)
    const currentUser = req.user;
    let finalCaretakerId = null;
    let finalStatus = 'street';

    if (currentUser && currentUser.role === 'caretaker') {
      finalCaretakerId = currentUser.id;
      finalStatus = 'fostered';
    } else if (currentUser && currentUser.role === 'admin') {
      finalCaretakerId = caretaker_id || caretakerId || currentUser.id;
      finalStatus = status || 'fostered';
    } else {
      finalCaretakerId = caretaker_id || caretakerId || null;
      finalStatus = (status || 'street').toLowerCase();
    }

    const result = await db.query(
      `INSERT INTO animals (
        caretaker_id, name, species, breed, age, gender,
        health_condition, personality_note, photo_url, photos, location_found, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
        finalPhotos,
        finalLocationFound ? finalLocationFound.trim() : null,
        finalStatus,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'ลงทะเบียนสัตว์เรียบร้อยแล้ว',
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/v1/animals (ดึงรายการสัตว์ - 200 OK)
async function getAllAnimals(req, res, next) {
  try {
    const { species, status, gender, search, caretaker_id, caretakerId, limit = 50, offset = 0 } = req.query;

    let queryText = `
      SELECT 
        a.*,
        u.name as caretaker_name,
        u.phone as caretaker_phone,
        u.email as caretaker_email
      FROM animals a
      LEFT JOIN users u ON a.caretaker_id = u.id
    `;
    const queryParams = [];
    const conditions = [];

    // Filter by specific caretaker if requested
    const targetCaretaker = caretaker_id || caretakerId;
    if (targetCaretaker) {
      queryParams.push(Number(targetCaretaker));
      conditions.push(`a.caretaker_id = $${queryParams.length}`);
    }

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

// PATCH /api/v1/animals/:id/claim (รับเป็นคนดูแล (claim) สัตว์ตัวนี้ - Caretaker / Admin - 200 OK)
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

    const checkAnimal = await db.query('SELECT * FROM animals WHERE id = $1', [Number(id)]);
    if (checkAnimal.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: `Animal with ID ${id} not found.` },
      });
    }

    const animal = checkAnimal.rows[0];

    if (animal.caretaker_id && animal.caretaker_id !== caretakerId && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: { message: `Animal is already claimed by another caretaker (ID: ${animal.caretaker_id}).` },
      });
    }

    const newStatus = animal.status === 'street' ? 'fostered' : animal.status;
    const updateResult = await db.query(
      `UPDATE animals 
       SET caretaker_id = $1, status = $2
       WHERE id = $3
       RETURNING *`,
      [caretakerId, newStatus, Number(id)]
    );

    return res.status(200).json({
      success: true,
      message: 'Animal claimed successfully',
      data: updateResult.rows[0],
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

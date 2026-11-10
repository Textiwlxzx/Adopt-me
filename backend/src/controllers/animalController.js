const db = require('../config/db');

// POST /api/v1/animals (แจ้ง/ลงทะเบียนสัตว์ที่พบใหม่ - 201 Created)
async function createAnimal(req, res, next) {
  try {
    const {
      name,
      species,
      breed,
      gender,
      age,
      color,
      status,
      location,
      description,
      image_url,
      imageUrl,
      contact_name,
      contactName,
      contact_phone,
      contactPhone,
    } = req.body;

    // Validate required fields
    if (!name || !location) {
      return res.status(400).json({
        success: false,
        error: { message: 'Animal name and location are required.' },
      });
    }

    const animalSpecies = species || 'unknown';
    const animalStatus = status || 'found';
    const finalImageUrl = image_url || imageUrl || null;
    const finalContactName = contact_name || contactName || null;
    const finalContactPhone = contact_phone || contactPhone || null;

    const result = await db.query(
      `INSERT INTO animals (
        name, species, breed, gender, age, color, status,
        location, description, image_url, contact_name, contact_phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        name.trim(),
        animalSpecies.trim(),
        breed ? breed.trim() : null,
        gender ? gender.trim() : null,
        age ? age.trim() : null,
        color ? color.trim() : null,
        animalStatus.trim(),
        location.trim(),
        description ? description.trim() : null,
        finalImageUrl,
        finalContactName,
        finalContactPhone,
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
    const { species, status, search, limit = 50, offset = 0 } = req.query;

    let queryText = 'SELECT * FROM animals';
    const queryParams = [];
    const conditions = [];

    if (species) {
      queryParams.push(species.toLowerCase());
      conditions.push(`LOWER(species) = $${queryParams.length}`);
    }

    if (status) {
      queryParams.push(status.toLowerCase());
      conditions.push(`LOWER(status) = $${queryParams.length}`);
    }

    if (search) {
      queryParams.push(`%${search.toLowerCase()}%`);
      const paramIndex = queryParams.length;
      conditions.push(`(
        LOWER(name) LIKE $${paramIndex} OR
        LOWER(breed) LIKE $${paramIndex} OR
        LOWER(location) LIKE $${paramIndex} OR
        LOWER(description) LIKE $${paramIndex}
      )`);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    queryText += ' ORDER BY created_at DESC';

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

    const result = await db.query('SELECT * FROM animals WHERE id = $1', [Number(id)]);

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

module.exports = {
  createAnimal,
  getAllAnimals,
  getAnimalById,
};

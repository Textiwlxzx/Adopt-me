const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// POST /api/v1/animals (แจ้ง/ลงทะเบียนสัตว์ที่พบใหม่ - Public)
router.post('/', animalController.createAnimal);

// GET /api/v1/animals (ดึงรายการสัตว์ทั้งหมด - Public)
router.get('/', animalController.getAllAnimals);

// GET /api/v1/animals/:id (ดูรายละเอียดสัตว์แต่ละตัว - Public)
router.get('/:id', animalController.getAnimalById);

// PATCH /api/v1/animals/:id/claim (รับเป็นคนดูแล (claim) สัตว์ตัวนี้ - Caretaker)
router.patch('/:id/claim', authenticate, authorize('caretaker'), animalController.claimAnimal);

module.exports = router;

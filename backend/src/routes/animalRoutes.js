const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// POST /api/v1/animals (ลงทะเบียนสัตว์ใหม่ - สงวนสิทธิ์เฉพาะ Caretaker และ Admin เท่านั้น)
router.post(
  '/',
  authenticate,
  authorize('caretaker', 'admin'),
  upload.single('image'),
  animalController.createAnimal
);

// GET /api/v1/animals (ดึงรายการสัตว์ทั้งหมด - Public)
router.get('/', animalController.getAllAnimals);

// GET /api/v1/animals/:id (ดูรายละเอียดสัตว์แต่ละตัว - Public)
router.get('/:id', animalController.getAnimalById);

// PATCH /api/v1/animals/:id/claim (รับเป็นคนดูแล (claim) สัตว์ตัวนี้ - Caretaker / Admin)
router.patch('/:id/claim', authenticate, authorize('caretaker', 'admin'), animalController.claimAnimal);

module.exports = router;

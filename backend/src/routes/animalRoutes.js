const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { authenticate, optionalAuthenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// POST /api/v1/animals (ลงทะเบียนสัตว์ใหม่ - ใครก็ได้ทั้ง Guest, Adopter, Caretaker, Admin)
router.post(
  '/',
  optionalAuthenticate,
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

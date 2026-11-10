const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');

// POST /api/v1/animals (แจ้ง/ลงทะเบียนสัตว์ที่พบใหม่ - Public)
router.post('/', animalController.createAnimal);

// GET /api/v1/animals (ดึงรายการสัตว์ทั้งหมด - Public)
router.get('/', animalController.getAllAnimals);

// GET /api/v1/animals/:id (ดูรายละเอียดสัตว์แต่ละตัว - Public)
router.get('/:id', animalController.getAnimalById);

module.exports = router;

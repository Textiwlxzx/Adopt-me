const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/v1/auth/register (สมัครสมาชิกใหม่ - Public)
router.post('/register', authController.register);

// POST /api/v1/auth/login (เข้าสู่ระบบ - Public)
router.post('/login', authController.login);

module.exports = router;

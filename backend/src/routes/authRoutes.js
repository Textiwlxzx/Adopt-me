const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/v1/auth/register  (สมัครสมาชิกด้วย email/password)
router.post('/register', authController.register);

// POST /api/v1/auth/login  (เข้าสู่ระบบด้วย email/password)
router.post('/login', authController.login);

// GET  /api/v1/auth/google  (Step 1 — Redirect ไป Google consent screen)
router.get('/google', authController.googleOauth);

// GET  /api/v1/auth/google/callback  (Step 2 — Google redirect กลับมา พร้อม ?code=)
router.get('/google/callback', authController.googleOauthCallback);

module.exports = router;

const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUpController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// POST /api/v1/follow-ups (บันทึกผลการติดตามหลังรับเลี้ยง - Caretaker)
router.post(
  '/',
  authenticate,
  authorize('caretaker', 'admin'),
  followUpController.createFollowUp
);

// GET /api/v1/follow-ups (ดูผลการติดตาม - Caretaker / Admin)
router.get(
  '/',
  authenticate,
  authorize('caretaker', 'admin'),
  followUpController.getFollowUps
);

module.exports = router;

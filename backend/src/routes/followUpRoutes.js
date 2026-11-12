const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUpController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// POST /api/v1/follow-ups (บันทึกผลการติดตามหลังรับเลี้ยง - Caretaker)
router.post(
  '/',
  authenticate,
  authorize('caretaker'),
  followUpController.createFollowUp
);

module.exports = router;


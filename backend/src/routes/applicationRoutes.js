const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// POST /api/v1/adoption-applications (ส่งใบสมัครขอรับเลี้ยง - Adopter)
router.post(
  '/',
  authenticate,
  authorize('adopter'),
  applicationController.submitApplication
);

// GET /api/v1/adoption-applications/me (ดูสถานะใบสมัครของตัวเอง - Adopter)
router.get(
  '/me',
  authenticate,
  authorize('adopter'),
  applicationController.getMyApplications
);

// PATCH /api/v1/adoption-applications/:id/status (อนุมัติ/ปฏิเสธใบสมัคร - Caretaker)
router.patch(
  '/:id/status',
  authenticate,
  authorize('caretaker'),
  applicationController.updateApplicationStatus
);

module.exports = router;


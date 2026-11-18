const express = require('express');
const router = express.Router();
const petUpdateController = require('../controllers/petUpdateController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');

// Allow both images and videos
const storage = multer.memoryStorage();
const mediaFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('รองรับเฉพาะไฟล์รูปภาพ (jpg, png, webp) หรือวิดีโอ (mp4, webm) เท่านั้น!'), false);
  }
};

const uploadMedia = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB limit for images/videos
  },
  fileFilter: mediaFilter,
});

// POST /api/v1/pet-updates (Adopter อัปเดตรูปถ่าย / วิดีโอน้องจากบ้านใหม่)
router.post(
  '/',
  authenticate,
  authorize('adopter', 'caretaker', 'admin'),
  uploadMedia.single('media'),
  petUpdateController.createPetUpdate
);

// GET /api/v1/pet-updates (ดูรายการอัปเดตของน้อง)
router.get(
  '/',
  authenticate,
  authorize('adopter', 'caretaker', 'admin'),
  petUpdateController.getPetUpdates
);

// PATCH /api/v1/pet-updates/:id/feedback (Caretaker กดดูและพิมพ์ Feedback / ให้คำแนะนำในการเลี้ยงดู)
router.patch(
  '/:id/feedback',
  authenticate,
  authorize('caretaker', 'admin'),
  petUpdateController.giveFeedback
);

module.exports = router;

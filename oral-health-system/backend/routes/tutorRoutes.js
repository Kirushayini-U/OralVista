const express = require("express");

const {
  getLessons,
  getLesson,
  submitQuiz,
  getMyProgress,
  getDashboardSummary,
} = require(
  "../controllers/tutorController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.use(protect);

router.get(
  "/lessons",
  getLessons
);

router.get(
  "/progress",
  getMyProgress
);

router.get(
  "/dashboard-summary",
  getDashboardSummary
);

router.get(
  "/lessons/:lessonId",
  getLesson
);

router.post(
  "/lessons/:lessonId/submit",
  submitQuiz
);

module.exports = router;
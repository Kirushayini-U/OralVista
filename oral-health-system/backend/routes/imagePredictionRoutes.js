const express = require("express");

const {
  protect,
  allowRoles,
} = require(
  "../middleware/authMiddleware"
);

const imageUpload = require(
  "../middleware/imageUploadMiddleware"
);

const {
  predictImage,
  getMyImagePredictionHistory,
  deleteMyImagePrediction,
} = require(
  "../controllers/imagePredictionController"
);

const router = express.Router();

/*
 * POST /api/image-predictions/predict
 *
 * Allows an authenticated patient to:
 * 1. Upload one oral image.
 * 2. Send it to the FastAPI CNN service.
 * 3. Save the prediction in MongoDB.
 */
router.post(
  "/predict",
  protect,
  allowRoles("patient"),
  imageUpload.single("image"),
  predictImage
);

/*
 * GET /api/image-predictions/history
 *
 * Returns only the prediction history belonging
 * to the currently authenticated patient.
 */
router.get(
  "/history",
  protect,
  allowRoles("patient"),
  getMyImagePredictionHistory
);

/*
 * DELETE /api/image-predictions/history/:id
 *
 * Deletes only a prediction belonging to the
 * currently authenticated patient.
 */
router.delete(
  "/history/:id",
  protect,
  allowRoles("patient"),
  deleteMyImagePrediction
);

module.exports = router;
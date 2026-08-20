const express = require("express");

const {
  protect,
  allowRoles,
} = require(
  "../middleware/authMiddleware"
);

const {
  predictSymptoms,
  getMySymptomPredictionHistory,
  deleteMySymptomPrediction,
} = require(
  "../controllers/symptomPredictionController"
);

const router = express.Router();


/*
 * POST /api/symptom-predictions/predict
 *
 * Allows an authenticated patient to:
 * 1. Submit the 14 symptom/risk-factor inputs.
 * 2. Send them to the FastAPI Random Forest service.
 * 3. Receive the prediction and SHAP explanation.
 * 4. Encrypt sensitive symptom inputs.
 * 5. Generate an HMAC-SHA256 integrity value.
 * 6. Save the prediction securely in MongoDB.
 */
router.post(
  "/predict",
  protect,
  allowRoles("patient"),
  predictSymptoms
);


/*
 * GET /api/symptom-predictions/history
 *
 * Returns only symptom predictions belonging
 * to the currently authenticated patient.
 */
router.get(
  "/history",
  protect,
  allowRoles("patient"),
  getMySymptomPredictionHistory
);


/*
 * DELETE /api/symptom-predictions/history/:id
 *
 * Deletes only a symptom prediction belonging
 * to the currently authenticated patient.
 */
router.delete(
  "/history/:id",
  protect,
  allowRoles("patient"),
  deleteMySymptomPrediction
);


module.exports = router;
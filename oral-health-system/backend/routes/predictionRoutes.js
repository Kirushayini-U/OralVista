import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { predictFromSymptoms, predictFromImage, getMyPredictions } from '../controllers/predictionController.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = express.Router();

router.post('/symptom', protect, predictFromSymptoms);
router.post('/image', protect, upload.single('image'), predictFromImage);
router.get('/mine', protect, getMyPredictions);

export default router;

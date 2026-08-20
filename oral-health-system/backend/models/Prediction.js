import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['symptom', 'image'], required: true },
    inputData: { type: mongoose.Schema.Types.Mixed },
    predictedDisease: { type: String },
    riskLevel: { type: String },
    confidence: { type: Number },
    recommendedActions: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Prediction', predictionSchema);

const mongoose = require("mongoose");


/*
 * Reusable structure for AES-256-GCM encrypted text.
 * This matches the structure already used by ImagePrediction.
 */
const encryptedTextSchema = new mongoose.Schema(
  {
    iv: {
      type: String,
      required: true,
    },

    authTag: {
      type: String,
      required: true,
    },

    encryptedData: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);


/*
 * SHAP explanation item.
 */
const shapExplanationSchema = new mongoose.Schema(
  {
    feature: {
      type: String,
      required: true,
      trim: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: Number,
      required: true,
    },

    shapValue: {
      type: Number,
      required: true,
    },

    impact: {
      type: String,
      required: true,
      enum: [
        "Supports prediction",
        "Reduces prediction",
        "Neutral",
      ],
    },

    importance: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);


const symptomPredictionSchema = new mongoose.Schema(
  {
    /*
     * Logged-in registered patient.
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },


    /*
     * All 14 symptom/risk inputs are serialized as JSON
     * and encrypted before storage using AES-256-GCM.
     */
    encryptedSymptoms: {
      type: encryptedTextSchema,
      required: true,
    },


    /*
     * Predicted oral-health condition.
     */
    prediction: {
      type: String,
      required: true,
      enum: [
        "Dental Caries",
        "Gingivitis",
        "Healthy",
        "Oral Thrush",
        "Oral Ulcer",
        "Periodontitis",
      ],
      index: true,
    },


    /*
     * Probability of the predicted class.
     */
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },


    confidenceLevel: {
      type: String,
      required: true,
      enum: [
        "Low",
        "Moderate",
        "High",
      ],
    },


    /*
     * Probability for all six classes.
     */
    probabilities: {
      dentalCaries: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      gingivitis: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      healthy: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      oralThrush: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      oralUlcer: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },

      periodontitis: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
    },


    /*
     * Top SHAP contributing factors returned by FastAPI.
     */
    shapExplanation: {
      type: [
        shapExplanationSchema,
      ],
      default: [],
    },


    recommendations: [
      {
        type: String,
        trim: true,
      },
    ],


    disclaimer: {
      type: String,
      required: true,
      trim: true,
    },


    modelName: {
      type: String,
      required: true,
      default: "OralVista Random Forest",
    },


    modelType: {
      type: String,
      required: true,
      default: "RandomForestClassifier",
    },


    modelVersion: {
      type: String,
      required: true,
      default: "1.0",
    },


    explainabilityMethod: {
      type: String,
      default: "SHAP TreeExplainer",
    },


    /*
     * HMAC-SHA256 integrity value.
     * Used to detect modification/tampering of stored data.
     */
    integrityHash: {
      type: String,
      required: true,
      minlength: 64,
      maxlength: 64,
      match: /^[a-f0-9]{64}$/i,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


/*
 * Speeds up patient-specific history queries.
 */
symptomPredictionSchema.index({
  user: 1,
  createdAt: -1,
});


/*
 * Useful for history filtering by predicted condition.
 */
symptomPredictionSchema.index({
  user: 1,
  prediction: 1,
  createdAt: -1,
});


module.exports = mongoose.model(
  "SymptomPrediction",
  symptomPredictionSchema
);
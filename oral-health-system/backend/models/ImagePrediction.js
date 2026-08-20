const mongoose = require("mongoose");

/*
 * Structure used to store encrypted text.
 * The filename is encrypted using AES-256-GCM.
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

const imagePredictionSchema = new mongoose.Schema(
  {
    /*
     * The registered patient who uploaded the image.
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /*
     * SHA-256 fingerprint of the uploaded image.
     * The original image is not stored in MongoDB.
     */
    imageHash: {
      type: String,
      required: true,
      minlength: 64,
      maxlength: 64,
      index: true,
    },

    /*
     * Predicted oral condition.
     */
    prediction: {
      type: String,
      required: true,
      enum: [
        "calculus",
        "gingivitis",
        "hypodontia",
      ],
      index: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * Confidence for this single image prediction.
     */
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    /*
     * Probability returned for every class.
     */
    probabilities: {
      calculus: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      gingivitis: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },

      hypodontia: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
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

    /*
     * The original filename is encrypted before storage.
     */
    encryptedFileName: {
      type: encryptedTextSchema,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
      enum: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ],
    },

    imageSizeBytes: {
      type: Number,
      required: true,
      min: 1,
    },

    duplicateImage: {
      type: Boolean,
      default: false,
    },

    modelName: {
      type: String,
      default: "EfficientNetB0 Transfer Learning",
    },

    modelVersion: {
      type: String,
      default: "1.0.0",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
 * Speeds up user prediction-history searches.
 */
imagePredictionSchema.index({
  user: 1,
  createdAt: -1,
});

/*
 * Speeds up duplicate image detection for each user.
 */
imagePredictionSchema.index({
  user: 1,
  imageHash: 1,
});

module.exports = mongoose.model(
  "ImagePrediction",
  imagePredictionSchema
);
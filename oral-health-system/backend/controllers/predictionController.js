import axios from "axios";

import Prediction from "../models/Prediction.js";
import SymptomPrediction from "../models/SymptomPrediction.js";

import {
  encrypt,
  createRecordHmac,
} from "../utils/encryption.js";


const FASTAPI_SYMPTOM_URL =
  process.env.FASTAPI_SYMPTOM_URL ||
  "http://127.0.0.1:8000/predict-symptoms";


const SYMPTOM_FIELDS = [
  "tooth_pain",
  "gum_bleeding",
  "bad_breath",
  "mouth_ulcer",
  "tooth_sensitivity",
  "swelling",
  "white_spots",
  "dry_mouth",
  "sugar_intake_high",
  "smoking",
  "betel_chewing",
  "brushing_frequency_low",
  "age",
  "water_intake_low",
];


function validateSymptomInput(body) {
  const cleaned = {};

  for (const field of SYMPTOM_FIELDS) {
    if (!(field in body)) {
      throw new Error(
        `Missing required symptom field: ${field}`
      );
    }

    const value = Number(body[field]);

    if (field === "age") {
      if (
        !Number.isInteger(value) ||
        value < 1 ||
        value > 120
      ) {
        throw new Error(
          "Age must be an integer between 1 and 120."
        );
      }
    } else {
      if (value !== 0 && value !== 1) {
        throw new Error(
          `${field} must be either 0 or 1.`
        );
      }
    }

    cleaned[field] = value;
  }

  return cleaned;
}


export async function predictFromSymptoms(
  req,
  res,
  next
) {
  try {
    const userId =
      req.user?.id ||
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }


    const symptomInput =
      validateSymptomInput(req.body);


    const aiResponse = await axios.post(
      FASTAPI_SYMPTOM_URL,
      symptomInput,
      {
        timeout: 15000,

        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );


    const aiResult =
      aiResponse.data;


    if (
      !aiResult ||
      aiResult.success !== true
    ) {
      return res.status(502).json({
        success: false,
        message:
          "Invalid response from the AI prediction service.",
      });
    }


    const encryptedSymptoms = encrypt(
      JSON.stringify(
        symptomInput
      )
    );


    const probabilities = {
      dentalCaries:
        Number(
          aiResult.probabilities?.[
            "Dental Caries"
          ] ?? 0
        ),

      gingivitis:
        Number(
          aiResult.probabilities?.[
            "Gingivitis"
          ] ?? 0
        ),

      healthy:
        Number(
          aiResult.probabilities?.[
            "Healthy"
          ] ?? 0
        ),

      oralThrush:
        Number(
          aiResult.probabilities?.[
            "Oral Thrush"
          ] ?? 0
        ),

      oralUlcer:
        Number(
          aiResult.probabilities?.[
            "Oral Ulcer"
          ] ?? 0
        ),

      periodontitis:
        Number(
          aiResult.probabilities?.[
            "Periodontitis"
          ] ?? 0
        ),
    };


    const integrityPayload = {
      user: String(userId),

      encryptedSymptoms,

      prediction:
        aiResult.prediction,

      confidence:
        Number(
          aiResult.confidence
        ),

      confidenceLevel:
        aiResult.confidenceLevel,

      probabilities,

      shapExplanation:
        aiResult.shapExplanation || [],

      recommendations:
        aiResult.recommendations || [],

      model: {
        name:
          aiResult.model?.name ||
          "OralVista Random Forest",

        type:
          aiResult.model?.type ||
          "RandomForestClassifier",

        version:
          aiResult.model?.version ||
          "1.0",

        explainability:
          aiResult.model?.explainability ||
          "SHAP TreeExplainer",
      },
    };


    const integrityHash =
      createRecordHmac(
        integrityPayload
      );


    const record =
      await SymptomPrediction.create({
        user: userId,

        encryptedSymptoms,

        prediction:
          aiResult.prediction,

        confidence:
          Number(
            aiResult.confidence
          ),

        confidenceLevel:
          aiResult.confidenceLevel,

        probabilities,

        shapExplanation:
          aiResult.shapExplanation || [],

        recommendations:
          aiResult.recommendations || [],

        disclaimer:
          aiResult.disclaimer,

        modelName:
          aiResult.model?.name ||
          "OralVista Random Forest",

        modelType:
          aiResult.model?.type ||
          "RandomForestClassifier",

        modelVersion:
          aiResult.model?.version ||
          "1.0",

        explainabilityMethod:
          aiResult.model
            ?.explainability ||
          "SHAP TreeExplainer",

        integrityHash,
      });


    return res.status(201).json({
      success: true,

      predictionId:
        record._id,

      prediction:
        record.prediction,

      confidence:
        record.confidence,

      confidenceLevel:
        record.confidenceLevel,

      probabilities:
        aiResult.probabilities,

      shapExplanation:
        record.shapExplanation,

      recommendations:
        record.recommendations,

      disclaimer:
        record.disclaimer,

      model: {
        name:
          record.modelName,

        type:
          record.modelType,

        version:
          record.modelVersion,

        explainability:
          record.explainabilityMethod,
      },

      integrityProtected: true,

      createdAt:
        record.createdAt,
    });
  } catch (err) {
    if (
      err.response &&
      err.response.data
    ) {
      return res.status(
        err.response.status || 502
      ).json({
        success: false,
        message:
          "AI symptom prediction failed.",
        details:
          err.response.data,
      });
    }

    if (
      err.message &&
      err.message.includes(
        "Missing required symptom field"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (
      err.message &&
      (
        err.message.includes(
          "must be either 0 or 1"
        ) ||
        err.message.includes(
          "Age must be"
        )
      )
    ) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    next(err);
  }
}


export async function predictFromImage(
  req,
  res,
  next
) {
  try {
    const result = {
      predictedDisease:
        "Dental Calculus (Tartar Detected)",

      riskLevel:
        "Medium",

      confidence:
        92,

      recommendedActions: [
        "Book a professional cleaning",
        "Improve daily flossing routine",
      ],
    };

    const record =
      await Prediction.create({
        user:
          req.user?.id,

        type:
          "image",

        ...result,
      });

    res.status(201).json(
      record
    );
  } catch (err) {
    next(err);
  }
}


export async function getMyPredictions(
  req,
  res,
  next
) {
  try {
    const predictions =
      await Prediction.find({
        user: req.user.id,
      }).sort({
        createdAt: -1,
      });

    res.json(
      predictions
    );
  } catch (err) {
    next(err);
  }
}
const axios = require("axios");

const SymptomPrediction = require(
  "../models/SymptomPrediction"
);

const {
  encrypt,
  decrypt,
  createRecordHmac,
  verifyRecordHmac,
} = require(
  "../utils/encryption"
);


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
      const error = new Error(
        `Missing required symptom field: ${field}`
      );

      error.statusCode = 400;
      throw error;
    }

    const value = Number(body[field]);

    if (field === "age") {
      if (
        !Number.isInteger(value) ||
        value < 1 ||
        value > 120
      ) {
        const error = new Error(
          "Age must be an integer between 1 and 120."
        );

        error.statusCode = 400;
        throw error;
      }
    } else {
      if (value !== 0 && value !== 1) {
        const error = new Error(
          `${field} must be either 0 or 1.`
        );

        error.statusCode = 400;
        throw error;
      }
    }

    cleaned[field] = value;
  }

  return cleaned;
}


function mapProbabilities(
  probabilities = {}
) {
  return {
    dentalCaries: Number(
      probabilities["Dental Caries"] ?? 0
    ),

    gingivitis: Number(
      probabilities["Gingivitis"] ?? 0
    ),

    healthy: Number(
      probabilities["Healthy"] ?? 0
    ),

    oralThrush: Number(
      probabilities["Oral Thrush"] ?? 0
    ),

    oralUlcer: Number(
      probabilities["Oral Ulcer"] ?? 0
    ),

    periodontitis: Number(
      probabilities["Periodontitis"] ?? 0
    ),
  };
}


function buildIntegrityPayload(recordData) {
  return {
    user: String(recordData.user),

    encryptedSymptoms:
      recordData.encryptedSymptoms,

    prediction:
      recordData.prediction,

    confidence:
      Number(recordData.confidence),

    confidenceLevel:
      recordData.confidenceLevel,

    probabilities:
      recordData.probabilities,

    shapExplanation:
      recordData.shapExplanation || [],

    recommendations:
      recordData.recommendations || [],

    model: {
      name:
        recordData.modelName,

      type:
        recordData.modelType,

      version:
        recordData.modelVersion,

      explainability:
        recordData.explainabilityMethod,
    },
  };
}


async function predictSymptoms(
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
        message:
          "Authentication required.",
      });
    }


    const symptomInput =
      validateSymptomInput(
        req.body
      );


    const aiResponse =
      await axios.post(
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
          "Invalid response from the AI symptom prediction service.",
      });
    }


    const encryptedSymptoms =
      encrypt(
        JSON.stringify(
          symptomInput
        )
      );


    const probabilities =
      mapProbabilities(
        aiResult.probabilities
      );


    const temporaryRecordData = {
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
    };


    const integrityHash =
      createRecordHmac(
        buildIntegrityPayload(
          temporaryRecordData
        )
      );


    const record =
      await SymptomPrediction.create({
        ...temporaryRecordData,

        disclaimer:
          aiResult.disclaimer,

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
  } catch (error) {
    if (error.response) {
      return res.status(
        error.response.status ||
        502
      ).json({
        success: false,
        message:
          "AI symptom prediction service failed.",
        details:
          error.response.data,
      });
    }

    if (
      error.code ===
      "ECONNREFUSED"
    ) {
      return res.status(503).json({
        success: false,
        message:
          "The AI symptom prediction service is currently unavailable.",
      });
    }

    next(error);
  }
}


async function getMySymptomPredictionHistory(
  req,
  res,
  next
) {
  try {
    const userId =
      req.user?.id ||
      req.user?._id;

    const records =
      await SymptomPrediction.find({
        user: userId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();


    const history = records.map(
      (record) => {
        const integrityPayload =
          buildIntegrityPayload(
            record
          );

        const integrityValid =
          verifyRecordHmac(
            integrityPayload,
            record.integrityHash
          );


        let symptoms = null;

        try {
          symptoms = JSON.parse(
            decrypt(
              record.encryptedSymptoms
            )
          );
        } catch (error) {
          symptoms = null;
        }


        return {
          id: record._id,

          symptoms,

          prediction:
            record.prediction,

          confidence:
            record.confidence,

          confidenceLevel:
            record.confidenceLevel,

          probabilities:
            record.probabilities,

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

          integrityValid,

          createdAt:
            record.createdAt,
        };
      }
    );


    return res.status(200).json({
      success: true,
      count: history.length,
      predictions: history,
    });
  } catch (error) {
    next(error);
  }
}


async function deleteMySymptomPrediction(
  req,
  res,
  next
) {
  try {
    const userId =
      req.user?.id ||
      req.user?._id;

    const prediction =
      await SymptomPrediction.findOne({
        _id: req.params.id,
        user: userId,
      });


    if (!prediction) {
      return res.status(404).json({
        success: false,
        message:
          "Symptom prediction was not found.",
      });
    }


    await prediction.deleteOne();


    return res.status(200).json({
      success: true,
      message:
        "Symptom prediction deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  predictSymptoms,
  getMySymptomPredictionHistory,
  deleteMySymptomPrediction,
};
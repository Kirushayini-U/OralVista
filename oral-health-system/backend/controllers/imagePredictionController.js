const axios = require("axios");
const FormData = require("form-data");
const path = require("path");

const ImagePrediction = require(
  "../models/ImagePrediction"
);

const {
  encrypt,
  decrypt,
  hashImage,
} = require("../utils/encryption");

const AI_API_URL =
  process.env.IMAGE_AI_API_URL ||
  "http://127.0.0.1:8000";


/*
 * Remove unsafe characters from uploaded filenames.
 */
function sanitizeFileName(fileName) {
  return path
    .basename(
      fileName || "oral-image"
    )
    .replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )
    .slice(
      0,
      150
    );
}


/*
 * Extract a useful message returned by FastAPI.
 */
function getFastApiErrorMessage(error) {
  const detail =
    error.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (
          typeof item?.msg ===
          "string"
        ) {
          return item.msg;
        }

        return String(item);
      })
      .join(" ");
  }

  const message =
    error.response?.data?.message;

  if (
    typeof message ===
    "string"
  ) {
    return message;
  }

  return null;
}


/*
 * =========================================================
 * POST IMAGE PREDICTION
 * =========================================================
 *
 * Flow:
 * 1. Receive image from Multer.
 * 2. Generate image hash.
 * 3. Check whether same patient previously uploaded it.
 * 4. Send image to FastAPI.
 * 5. FastAPI performs:
 *    - file/image validation
 *    - OpenCV quality validation
 *    - CLIP oral/non-oral validation
 *    - EfficientNetB0 dental prediction
 * 6. If FastAPI rejects the image, do NOT save history.
 * 7. Save only successful dental predictions in MongoDB.
 */
exports.predictImage = async (
  req,
  res
) => {
  try {
    if (!req.user?._id) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication is required.",
        });
    }


    /*
     * Uploaded file must exist.
     */
    if (!req.file) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Please upload an oral image.",
        });
    }


    const userId =
      req.user._id;


    /*
     * Generate SHA-256 hash.
     */
    const imageHash =
      hashImage(
        req.file.buffer
      );


    /*
     * Check whether this patient has previously
     * uploaded exactly the same image.
     *
     * IMPORTANT:
     * This only checks for duplicates.
     * It does NOT create any history record yet.
     */
    const previousRecord =
      await ImagePrediction
        .findOne({
          user: userId,
          imageHash,
        })
        .sort({
          createdAt: -1,
        })
        .lean();


    const safeFileName =
      sanitizeFileName(
        req.file.originalname
      );


    /*
     * =====================================================
     * PREPARE IMAGE FOR FASTAPI
     * =====================================================
     *
     * FastAPI expects form-data field:
     *
     * file
     */
    const formData =
      new FormData();

    formData.append(
      "file",
      req.file.buffer,
      {
        filename:
          safeFileName,

        contentType:
          req.file.mimetype,

        knownLength:
          req.file.size,
      }
    );


    /*
     * =====================================================
     * SEND IMAGE TO FASTAPI
     * =====================================================
     *
     * FastAPI will reject invalid/non-oral images
     * before the dental CNN prediction runs.
     */
    const aiResponse =
      await axios.post(
        `${AI_API_URL}/predict`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },

          /*
           * CLIP validation can take longer,
           * especially on CPU.
           */
          timeout: 120000,

          maxBodyLength:
            6 * 1024 * 1024,

          maxContentLength:
            6 * 1024 * 1024,
        }
      );


    const aiResult =
      aiResponse.data;


    /*
     * Validate FastAPI success response.
     */
    if (!aiResult?.success) {
      return res
        .status(502)
        .json({
          success: false,
          message:
            "The AI prediction service returned an invalid response.",
        });
    }


    /*
     * =====================================================
     * SAVE ONLY SUCCESSFUL DENTAL PREDICTION
     * =====================================================
     *
     * If FastAPI returned 422 for a tree, car,
     * landscape, etc., execution never reaches here.
     *
     * Therefore invalid/non-oral images are NOT saved.
     */
    const predictionRecord =
      await ImagePrediction.create({
        user:
          userId,

        imageHash,

        prediction:
          String(
            aiResult.prediction
          ).toLowerCase(),

        displayName:
          aiResult.displayName,

        confidence:
          aiResult.confidence,

        probabilities: {
          calculus:
            aiResult
              .probabilities
              ?.calculus || 0,

          gingivitis:
            aiResult
              .probabilities
              ?.gingivitis || 0,

          hypodontia:
            aiResult
              .probabilities
              ?.hypodontia || 0,
        },

        recommendations:
          Array.isArray(
            aiResult.recommendations
          )
            ? aiResult.recommendations
            : [],

        disclaimer:
          aiResult.disclaimer,

        encryptedFileName:
          encrypt(
            safeFileName
          ),

        mimeType:
          req.file.mimetype,

        imageSizeBytes:
          req.file.size,

        duplicateImage:
          Boolean(
            previousRecord
          ),

        modelName:
          aiResult.model ||
          "EfficientNetB0 Transfer Learning",

        modelVersion:
          "1.0.0",
      });


    /*
     * =====================================================
     * SUCCESS RESPONSE TO REACT FRONTEND
     * =====================================================
     */
    return res
      .status(201)
      .json({
        success: true,

        message:
          "Image prediction completed successfully.",

        duplicateImage:
          Boolean(
            previousRecord
          ),

        previousPredictionId:
          previousRecord?._id ||
          null,

        result: {
          id:
            predictionRecord._id,

          prediction:
            predictionRecord
              .prediction,

          displayName:
            predictionRecord
              .displayName,

          confidence:
            predictionRecord
              .confidence,

          probabilities:
            predictionRecord
              .probabilities,

          recommendations:
            predictionRecord
              .recommendations,

          disclaimer:
            predictionRecord
              .disclaimer,

          modelName:
            predictionRecord
              .modelName,

          createdAt:
            predictionRecord
              .createdAt,

          /*
           * Optional technical validation information.
           * Useful for testing/debugging.
           */
          imageQualityValidation:
            aiResult
              .imageQualityValidation ||
            null,

          oralImageValidation:
            aiResult
              .oralImageValidation ||
            null,
        },
      });
  } catch (error) {
    console.error(
      "Image prediction controller error:",
      error.response?.data ||
      error.message
    );


    /*
     * =====================================================
     * PYTHON AI SERVICE NOT RUNNING
     * =====================================================
     */
    if (
      error.code ===
        "ECONNREFUSED" ||
      error.cause?.code ===
        "ECONNREFUSED"
    ) {
      return res
        .status(503)
        .json({
          success: false,
          errorType:
            "AI_SERVICE_UNAVAILABLE",
          message:
            "The Python AI service is not running.",
        });
    }


    /*
     * =====================================================
     * FASTAPI VALIDATION ERRORS
     * =====================================================
     *
     * 400 = invalid image/file
     * 413 = file too large
     * 415 = unsupported image format
     * 422 = poor-quality or non-oral image
     *
     * IMPORTANT:
     * We forward FastAPI's real message to React.
     */
    const fastApiStatus =
      error.response?.status;

    if (
      [
        400,
        413,
        415,
        422,
      ].includes(
        fastApiStatus
      )
    ) {
      const fastApiMessage =
        getFastApiErrorMessage(
          error
        );

      return res
        .status(
          fastApiStatus
        )
        .json({
          success: false,

          errorType:
            fastApiStatus === 422
              ? "INVALID_ORAL_IMAGE"
              : "IMAGE_VALIDATION_ERROR",

          message:
            fastApiMessage ||
            "The uploaded image could not be processed.",

          /*
           * This makes it clear that no
           * prediction record was stored.
           */
          predictionSaved:
            false,
        });
    }


    /*
     * =====================================================
     * FASTAPI SERVER ERRORS
     * =====================================================
     */
    if (
      fastApiStatus &&
      fastApiStatus >= 500
    ) {
      return res
        .status(502)
        .json({
          success: false,
          errorType:
            "AI_SERVICE_ERROR",
          message:
            "The AI image-analysis service encountered an error. Please try again.",
          predictionSaved:
            false,
        });
    }


    /*
     * Axios timeout
     */
    if (
      error.code ===
      "ECONNABORTED"
    ) {
      return res
        .status(504)
        .json({
          success: false,
          errorType:
            "AI_TIMEOUT",
          message:
            "The image analysis took too long. Please try again.",
          predictionSaved:
            false,
        });
    }


    /*
     * =====================================================
     * UNEXPECTED ERROR
     * =====================================================
     */
    return res
      .status(500)
      .json({
        success: false,
        errorType:
          "IMAGE_PREDICTION_ERROR",
        message:
          "Unable to complete the image prediction.",
        predictionSaved:
          false,
      });
  }
};


/*
 * =========================================================
 * GET IMAGE PREDICTION HISTORY
 * =========================================================
 *
 * Filename is decrypted only when the authenticated
 * patient requests their own history.
 */
exports.getMyImagePredictionHistory =
  async (
    req,
    res
  ) => {
    try {
      if (!req.user?._id) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Authentication is required.",
          });
      }


      const records =
        await ImagePrediction
          .find({
            user:
              req.user._id,
          })
          .sort({
            createdAt: -1,
          })
          .lean();


      const predictions =
        records.map(
          (record) => {
            let originalFileName =
              "Unavailable";


            /*
             * Decrypt original filename.
             */
            try {
              originalFileName =
                decrypt(
                  record
                    .encryptedFileName
                );
            } catch (
              decryptionError
            ) {
              console.error(
                "Filename decryption error:",
                decryptionError.message
              );
            }


            return {
              id:
                record._id,

              prediction:
                record.prediction,

              displayName:
                record.displayName,

              confidence:
                record.confidence,

              probabilities:
                record.probabilities,

              recommendations:
                record.recommendations,

              disclaimer:
                record.disclaimer,

              originalFileName,

              imageHash:
                record.imageHash,

              mimeType:
                record.mimeType,

              imageSizeBytes:
                record.imageSizeBytes,

              duplicateImage:
                record.duplicateImage,

              modelName:
                record.modelName,

              modelVersion:
                record.modelVersion,

              createdAt:
                record.createdAt,
            };
          }
        );


      return res
        .status(200)
        .json({
          success: true,

          count:
            predictions.length,

          predictions,
        });
    } catch (error) {
      console.error(
        "Image prediction history error:",
        error.message
      );


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to retrieve image prediction history.",
        });
    }
  };


/*
 * =========================================================
 * DELETE IMAGE PREDICTION
 * =========================================================
 *
 * Deletes only a prediction belonging to
 * the currently authenticated patient.
 */
exports.deleteMyImagePrediction =
  async (
    req,
    res
  ) => {
    try {
      if (!req.user?._id) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Authentication is required.",
          });
      }


      const deletedRecord =
        await ImagePrediction
          .findOneAndDelete({
            _id:
              req.params.id,

            user:
              req.user._id,
          });


      if (!deletedRecord) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Prediction record was not found.",
          });
      }


      return res
        .status(200)
        .json({
          success: true,

          message:
            "Prediction record deleted successfully.",
        });
    } catch (error) {
      console.error(
        "Delete prediction error:",
        error.message
      );


      if (
        error.name ===
        "CastError"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "The prediction ID is invalid.",
          });
      }


      return res
        .status(500)
        .json({
          success: false,
          message:
            "Unable to delete the prediction record.",
        });
    }
  };
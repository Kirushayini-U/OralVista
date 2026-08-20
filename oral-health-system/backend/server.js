require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDatabase = require(
  "./config/db"
);

/* =====================================================
   ROUTE IMPORTS
===================================================== */

const authRoutes = require(
  "./routes/authRoutes"
);

const adminRoutes = require(
  "./routes/adminRoutes"
);

const profileRoutes = require(
  "./routes/profileRoutes"
);

const chatRoutes = require(
  "./routes/chatRoutes"
);

const tutorRoutes = require(
  "./routes/tutorRoutes"
);

const clinicRoutes = require(
  "./routes/clinicRoutes"
);

const newsletterRoutes = require(
  "./routes/newsletterRoutes"
);

const imagePredictionRoutes = require(
  "./routes/imagePredictionRoutes"
);

const symptomPredictionRoutes = require(
  "./routes/symptomPredictionRoutes"
);

const app = express();

/* =====================================================
   DATABASE CONNECTION
===================================================== */

connectDatabase();

/* =====================================================
   REQUIRED ENVIRONMENT VARIABLE CHECKS
===================================================== */

const requiredEnvironmentVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "FIELD_ENCRYPTION_KEY",
  "IMAGE_AI_API_URL",
];

const missingEnvironmentVariables =
  requiredEnvironmentVariables.filter(
    (variableName) =>
      !process.env[variableName]
  );

if (
  missingEnvironmentVariables.length > 0
) {
  console.error(
    "Missing required environment variables:",
    missingEnvironmentVariables.join(", ")
  );

  process.exit(1);
}

/*
 * AES-256 requires a 32-byte key.
 * A hexadecimal representation must contain
 * exactly 64 characters.
 */
if (
  !/^[a-fA-F0-9]{64}$/.test(
    process.env.FIELD_ENCRYPTION_KEY
  )
) {
  console.error(
    "FIELD_ENCRYPTION_KEY must contain exactly 64 hexadecimal characters."
  );

  process.exit(1);
}

/* =====================================================
   CORS CONFIGURATION
===================================================== */

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =====================================================
   REQUEST BODY CONFIGURATION
===================================================== */

/*
 * The regular JSON body limit is kept at 10 MB
 * because profile images may currently be stored
 * as base64 strings.
 *
 * Uploaded CNN images use Multer separately and
 * are restricted to 5 MB.
 */
app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* =====================================================
   BASIC TEST ROUTES
===================================================== */

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "OralVista System backend is running.",
  });
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "ok",
    message:
      "Backend and API are working.",
    services: {
      nodeBackend: "running",
      mongoDatabase:
        "connection attempted",

      imageAiApi:
        process.env.IMAGE_AI_API_URL,

      symptomAiApi:
        process.env.FASTAPI_SYMPTOM_URL ||
        "http://127.0.0.1:8000/predict-symptoms",
    },
  });
});

/* =====================================================
   APPLICATION ROUTES
===================================================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/tutor",
  tutorRoutes
);

app.use(
  "/api/clinics",
  clinicRoutes
);

app.use(
  "/api/newsletters",
  newsletterRoutes
);

/*
 * CNN image prediction routes:
 *
 * POST   /api/image-predictions/predict
 * GET    /api/image-predictions/history
 * DELETE /api/image-predictions/history/:id
 */
app.use(
  "/api/image-predictions",
  imagePredictionRoutes
);

/*
 * Random Forest symptom prediction routes:
 *
 * POST   /api/symptom-predictions/predict
 * GET    /api/symptom-predictions/history
 * DELETE /api/symptom-predictions/history/:id
 */
app.use(
  "/api/symptom-predictions",
  symptomPredictionRoutes
);

/* =====================================================
   ROUTE NOT FOUND HANDLER
===================================================== */

/*
 * This must remain below all registered routes.
 */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message:
      "API endpoint was not found.",
    path: req.originalUrl,
  });
});

/* =====================================================
   GLOBAL ERROR HANDLER
===================================================== */

/*
 * Express identifies an error handler because it
 * contains four parameters:
 *
 * error, req, res, next
 */
app.use(
  (error, req, res, next) => {
    console.error(
      "Unhandled server error:",
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    /*
     * Multer file-size error.
     */
    if (
      error.name === "MulterError" &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      return res.status(413).json({
        success: false,
        message:
          `The uploaded image exceeds the ${
            process.env
              .MAX_IMAGE_SIZE_MB || 5
          } MB limit.`,
      });
    }

    /*
     * More than one uploaded file.
     */
    if (
      error.name === "MulterError" &&
      error.code === "LIMIT_FILE_COUNT"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only one oral image can be uploaded at a time.",
      });
    }

    /*
     * Unexpected multipart field name.
     */
    if (
      error.name === "MulterError" &&
      error.code ===
        "LIMIT_UNEXPECTED_FILE"
    ) {
      return res.status(400).json({
        success: false,
        message:
          'The image must be uploaded using the form-data field name "image".',
      });
    }

    /*
     * Invalid image type from
     * imageUploadMiddleware.js.
     */
    if (
      error.message?.includes(
        "Only JPG"
      )
    ) {
      return res.status(415).json({
        success: false,
        message: error.message,
      });
    }

    /*
     * Invalid MongoDB ObjectId.
     */
    if (
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The supplied record ID is invalid.",
      });
    }

    /*
     * MongoDB duplicate-key error.
     */
    if (
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "A record with the supplied value already exists.",
      });
    }

    /*
     * Mongoose schema validation error.
     */
    if (
      error.name ===
      "ValidationError"
    ) {
      const validationMessages =
        Object.values(
          error.errors || {}
        ).map(
          (validationError) =>
            validationError.message
        );

      return res.status(400).json({
        success: false,
        message:
          validationMessages.join(
            " "
          ) ||
          "Database validation failed.",
      });
    }

    /*
     * Axios timeout while calling AI service.
     */
    if (
      error.code === "ECONNABORTED"
    ) {
      return res.status(504).json({
        success: false,
        message:
          "The AI prediction service took too long to respond.",
      });
    }

    /*
     * AI service connection failure.
     */
    if (
      error.code === "ECONNREFUSED"
    ) {
      return res.status(503).json({
        success: false,
        message:
          "The AI prediction service is currently unavailable.",
      });
    }

    return res
      .status(
        error.statusCode || 500
      )
      .json({
        success: false,
        message:
          error.message ||
          "An unexpected server error occurred.",
      });
  }
);

/* =====================================================
   START SERVER
===================================================== */

const port =
  process.env.PORT || 5000;

app.listen(port, () => {
  console.log(
    `Server running on http://localhost:${port}`
  );

  console.log(
    `Image AI API: ${
      process.env.IMAGE_AI_API_URL
    }`
  );

  console.log(
    `Symptom AI API: ${
      process.env.FASTAPI_SYMPTOM_URL ||
      "http://127.0.0.1:8000/predict-symptoms"
    }`
  );
});
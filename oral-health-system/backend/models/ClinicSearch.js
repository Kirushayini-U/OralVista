const mongoose = require("mongoose");

/* =====================================================
   CLINIC RESULT SUBDOCUMENT
===================================================== */

const clinicSchema = new mongoose.Schema(
  {
    placeId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    rating: {
      type: Number,
      default: null,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    businessStatus: {
      type: String,
      default: "",
      trim: true,
    },

    isOpen: {
      type: Boolean,
      default: null,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    distanceKm: {
      type: Number,
      default: null,
      min: 0,
    },

    googleMapsUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* =====================================================
   PATIENT CLINIC SEARCH HISTORY
===================================================== */

const clinicSearchSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      /*
       * Patient information is saved as a snapshot.
       * This allows the administrator to identify
       * the patient even if the profile changes later.
       */
      patientName: {
        type: String,
        required: true,
        trim: true,
      },

      patientEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      searchMode: {
        type: String,
        enum: [
          "text",
          "current-location",
        ],
        default: "text",
      },

      searchedLocation: {
        type: String,
        required: true,
        trim: true,
      },

      searchLatitude: {
        type: Number,
        default: null,
      },

      searchLongitude: {
        type: Number,
        default: null,
      },

      radiusMeters: {
        type: Number,
        default: 10000,
        min: 500,
        max: 50000,
      },

      clinicsFound: {
        type: Number,
        required: true,
        min: 0,
      },

      clinics: {
        type: [clinicSchema],
        default: [],
      },

      searchedAt: {
        type: Date,
        default: Date.now,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

/* =====================================================
   INDEXES
===================================================== */

clinicSearchSchema.index({
  searchedAt: -1,
});

clinicSearchSchema.index({
  patientEmail: 1,
  searchedAt: -1,
});

clinicSearchSchema.index({
  searchedLocation: 1,
  searchedAt: -1,
});

module.exports = mongoose.model(
  "ClinicSearch",
  clinicSearchSchema
);
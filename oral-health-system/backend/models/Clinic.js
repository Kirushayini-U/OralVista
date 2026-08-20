const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    status: {
      type: String,
      enum: ["Active", "Pending", "Blocked"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clinic", clinicSchema);
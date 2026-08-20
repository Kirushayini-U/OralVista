const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    summary: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "sent"],
      default: "draft",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    sentAt: {
      type: Date,
      default: null,
    },

    recipientCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    failedRecipientCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

newsletterSchema.index({
  status: 1,
  publishedAt: -1,
});

module.exports = mongoose.model(
  "Newsletter",
  newsletterSchema
);

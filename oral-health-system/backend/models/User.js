const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [
        true,
        "Full name is required.",
      ],
      trim: true,
      minlength: [
        2,
        "Full name must contain at least 2 characters.",
      ],
      maxlength: [
        100,
        "Full name cannot exceed 100 characters.",
      ],
    },

    email: {
      type: String,
      required: [
        true,
        "Email address is required.",
      ],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address.",
      ],
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: [
        30,
        "Phone number cannot exceed 30 characters.",
      ],
    },

    /*
     * Hidden from normal queries.
     * Use .select("+password") only when needed.
     */
    password: {
      type: String,
      required: [
        true,
        "Password is required.",
      ],
      minlength: [
        8,
        "Password must contain at least 8 characters.",
      ],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: [
          "patient",
          "admin",
        ],
        message:
          "Role must be either patient or admin.",
      },
      default: "patient",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /*
     * Records the time of the most recent
     * successful password change.
     */
    passwordChangedAt: {
      type: Date,
      default: null,
    },

    profileImage: {
      type: String,
      default: "",
      trim: true,
    },

    language: {
      type: String,
      enum: {
        values: [
          "English",
          "Sinhala",
          "Tamil",
        ],
        message:
          "Language must be English, Sinhala or Tamil.",
      },
      default: "English",
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },

    theme: {
      type: String,
      enum: {
        values: [
          "Light",
          "Dark",
        ],
        message:
          "Theme must be Light or Dark.",
      },
      default: "Light",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/*
 * Normalise important text values before validation.
 */
userSchema.pre(
  "validate",
  function normalizeUserFields(next) {
    if (this.fullName) {
      this.fullName =
        this.fullName
          .replace(/\s+/g, " ")
          .trim();
    }

    if (this.email) {
      this.email =
        this.email
          .toLowerCase()
          .trim();
    }

    if (this.phone) {
      this.phone =
        this.phone.trim();
    }

    next();
  }
);

/*
 * Hash the password before saving.
 *
 * This runs only when:
 * 1. A new user is created, or
 * 2. The password field is changed.
 */
userSchema.pre(
  "save",
  async function hashPassword(next) {
    try {
      if (!this.isModified("password")) {
        return next();
      }

      const salt = await bcrypt.genSalt(12);

      this.password = await bcrypt.hash(
        this.password,
        salt
      );

      /*
       * Do not set passwordChangedAt for the
       * initial user creation.
       */
      if (!this.isNew) {
        this.passwordChangedAt =
          new Date(Date.now() - 1000);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  }
);

/*
 * Compare an entered plain password
 * with the stored bcrypt hash.
 */
userSchema.methods.comparePassword =
  async function comparePassword(
    enteredPassword
  ) {
    if (
      !enteredPassword ||
      !this.password
    ) {
      return false;
    }

    return bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

/*
 * Check whether the password changed
 * after the JWT was issued.
 */
userSchema.methods.changedPasswordAfter =
  function changedPasswordAfter(
    tokenIssuedAt
  ) {
    if (
      !this.passwordChangedAt ||
      !tokenIssuedAt
    ) {
      return false;
    }

    const passwordChangedTimestamp =
      Math.floor(
        this.passwordChangedAt.getTime() /
          1000
      );

    return (
      passwordChangedTimestamp >
      Number(tokenIssuedAt)
    );
  };

/*
 * Remove sensitive fields when converted
 * to a normal JSON response.
 */
userSchema.set("toJSON", {
  transform(document, returnedObject) {
    delete returnedObject.password;

    return returnedObject;
  },
});

/*
 * Also remove sensitive fields when
 * converted to a plain JavaScript object.
 */
userSchema.set("toObject", {
  transform(document, returnedObject) {
    delete returnedObject.password;

    return returnedObject;
  },
});

module.exports = mongoose.model(
  "User",
  userSchema
);
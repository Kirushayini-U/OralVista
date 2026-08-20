const bcrypt = require("bcryptjs");

const User = require("../models/User");

/*
 * Return a safe user object without the password.
 */
const createSafeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
  isActive: user.isActive,
  profileImage: user.profileImage || "",
  language: user.language || "English",

  /*
   * This field is also used as the patient's
   * newsletter subscription preference.
   *
   * true  = subscribed
   * false = unsubscribed
   */
  notificationsEnabled:
    user.notificationsEnabled !== false,

  theme: user.theme || "Light",
  passwordChangedAt:
    user.passwordChangedAt || null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/*
 * GET /api/profile/me
 *
 * Return the currently authenticated
 * patient or administrator profile.
 */
exports.getMyProfile = async (req, res) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication is required.",
      });
    }

    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User account was not found.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message:
          "This account has been disabled.",
      });
    }

    return res.status(200).json({
      success: true,
      user: createSafeUser(user),
    });
  } catch (error) {
    console.error(
      "Get profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve the profile.",
    });
  }
};

/*
 * PATCH /api/profile/me
 *
 * Update the authenticated user's:
 * - full name
 * - phone number
 * - profile image
 * - language
 * - newsletter preference
 * - theme
 *
 * Email and role are not changed here.
 */
exports.updateMyProfile = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication is required.",
      });
    }

    const {
      fullName,
      phone,
      profileImage,
      language,
      notificationsEnabled,
      theme,
    } = req.body;

    const user = await User.findById(
      userId
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User account was not found.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message:
          "This account has been disabled.",
      });
    }

    /*
     * Update full name.
     */
    if (fullName !== undefined) {
      const normalizedName =
        String(fullName).trim();

      if (normalizedName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Full name must contain at least 2 characters.",
        });
      }

      if (normalizedName.length > 100) {
        return res.status(400).json({
          success: false,
          message:
            "Full name cannot exceed 100 characters.",
        });
      }

      user.fullName = normalizedName;
    }

    /*
     * Update phone number.
     */
    if (phone !== undefined) {
      const normalizedPhone =
        String(phone).trim();

      if (
        normalizedPhone &&
        !/^[0-9+\-\s()]{7,20}$/.test(
          normalizedPhone
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid phone number.",
        });
      }

      user.phone = normalizedPhone;
    }

    /*
     * Update profile image.
     *
     * Supports:
     * - base64 images
     * - normal HTTP/HTTPS image URLs
     * - an empty string to remove the image
     */
    if (profileImage !== undefined) {
      const imageValue =
        String(profileImage || "");

      const isBase64Image =
        imageValue.startsWith(
          "data:image/"
        );

      const isImageUrl =
        /^https?:\/\//i.test(
          imageValue
        );

      if (
        imageValue &&
        !isBase64Image &&
        !isImageUrl
      ) {
        return res.status(400).json({
          success: false,
          message:
            "The selected profile image is invalid.",
        });
      }

      user.profileImage = imageValue;
    }

    /*
     * Update language.
     */
    if (language !== undefined) {
      const allowedLanguages = [
        "English",
        "Sinhala",
        "Tamil",
      ];

      if (
        !allowedLanguages.includes(
          language
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Language must be English, Sinhala or Tamil.",
        });
      }

      user.language = language;
    }

    /*
     * Newsletter subscription preference.
     *
     * This is the Step 3 correction.
     *
     * true  = subscribed
     * false = unsubscribed
     */
    if (
      notificationsEnabled !== undefined
    ) {
      if (
        typeof notificationsEnabled !==
        "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Newsletter preference must be true or false.",
        });
      }

      user.notificationsEnabled =
        notificationsEnabled;
    }

    /*
     * Update theme.
     */
    if (theme !== undefined) {
      const allowedThemes = [
        "Light",
        "Dark",
      ];

      if (
        !allowedThemes.includes(theme)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Theme must be Light or Dark.",
        });
      }

      user.theme = theme;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully.",
      user: createSafeUser(user),
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      const validationMessage =
        Object.values(error.errors)[0]
          ?.message;

      return res.status(400).json({
        success: false,
        message:
          validationMessage ||
          "The profile information is invalid.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to update the profile.",
    });
  }
};

/*
 * PATCH /api/profile/change-password
 *
 * Works for both:
 * - patient accounts
 * - administrator accounts
 */
exports.changeMyPassword = async (
  req,
  res
) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication is required.",
      });
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please complete all password fields.",
      });
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password and confirmation do not match.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "The new password must contain at least 8 characters.",
      });
    }

    if (
      currentPassword ===
      newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The new password must be different from the current password.",
      });
    }

    /*
     * Password has select: false in User.js.
     * Therefore it must be selected explicitly.
     */
    const user = await User.findById(
      userId
    ).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User account was not found.",
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message:
          "This account has been disabled.",
      });
    }

    const passwordIsCorrect =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!passwordIsCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "The current password is incorrect.",
      });
    }

    /*
     * Do not manually hash the password here.
     * The pre-save middleware in User.js
     * encrypts it automatically.
     */
    user.password = newPassword;

    user.passwordChangedAt =
      new Date(Date.now() - 1000);

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please use the new password for your next login.",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    if (
      error.name ===
      "ValidationError"
    ) {
      const validationMessage =
        Object.values(error.errors)[0]
          ?.message;

      return res.status(400).json({
        success: false,
        message:
          validationMessage ||
          "The new password is invalid.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to change the password.",
    });
  }
};
const mongoose = require("mongoose");

const User = require("../models/User");

const SymptomPrediction = require(
  "../models/SymptomPrediction"
);

const ImagePrediction = require(
  "../models/ImagePrediction"
);


/* =====================================================
   GET ALL REGISTERED PATIENT USERS
===================================================== */

/**
 * GET /api/admin/users
 *
 * Return all registered patient accounts.
 * Password is never returned.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "patient",
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve registered users.",
    });
  }
};


/* =====================================================
   GET ONE REGISTERED PATIENT
===================================================== */

/**
 * GET /api/admin/users/:id
 *
 * Return one registered patient account.
 */
exports.getUserById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid user ID.",
      });
    }

    const user =
      await User.findOne({
        _id: id,
        role: "patient",
      }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Registered user was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "Get user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve the selected user.",
    });
  }
};


/* =====================================================
   DELETE REGISTERED PATIENT
===================================================== */

/**
 * DELETE /api/admin/users/:id
 *
 * Permanently delete one patient account.
 */
exports.deleteUser = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid user ID.",
      });
    }

    const user =
      await User.findOne({
        _id: id,
        role: "patient",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Registered patient was not found.",
      });
    }

    await User.deleteOne({
      _id: user._id,
    });

    return res.status(200).json({
      success: true,

      message:
        `${user.fullName} was deleted successfully.`,

      deletedUserId:
        user._id,
    });
  } catch (error) {
    console.error(
      "Delete user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete the registered user.",
    });
  }
};


/* =====================================================
   ACTIVATE / BLOCK REGISTERED PATIENT
===================================================== */

/**
 * PATCH /api/admin/users/:id/status
 *
 * Activate or block one patient account.
 */
exports.updateUserStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      isActive,
    } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid user ID.",
      });
    }

    if (
      typeof isActive !==
      "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "isActive must be true or false.",
      });
    }

    const user =
      await User.findOneAndUpdate(
        {
          _id: id,
          role: "patient",
        },
        {
          isActive,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Registered patient was not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: isActive
        ? "User account activated successfully."
        : "User account blocked successfully.",

      user,
    });
  } catch (error) {
    console.error(
      "Update user status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update the user status.",
    });
  }
};


/* =====================================================
   AI PREDICTION SUMMARY + DISTRIBUTION
===================================================== */

/**
 * GET /api/admin/prediction-summary
 *
 * Return:
 *
 * 1. Total symptom predictions
 * 2. Total image predictions
 * 3. Total combined predictions
 * 4. Symptom disease distribution
 * 5. Image prediction class distribution
 *
 * This endpoint is protected through
 * adminRoutes.js and can only be accessed
 * by an authenticated administrator.
 */
exports.getPredictionSummary = async (
  req,
  res
) => {
  try {
    const [
      symptomPredictions,
      imagePredictions,
      symptomDistributionRaw,
      imageDistributionRaw,
    ] = await Promise.all([
      /*
       * Total symptom prediction records.
       */
      SymptomPrediction.countDocuments(),

      /*
       * Total image prediction records.
       */
      ImagePrediction.countDocuments(),

      /*
       * Group symptom predictions
       * according to predicted condition.
       */
      SymptomPrediction.aggregate([
        {
          $group: {
            _id: "$prediction",

            count: {
              $sum: 1,
            },
          },
        },
      ]),

      /*
       * Group image predictions
       * according to predicted class.
       */
      ImagePrediction.aggregate([
        {
          $group: {
            _id: "$prediction",

            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);


    /* =================================================
       TOTAL PREDICTIONS
    ================================================= */

    const totalPredictions =
      symptomPredictions +
      imagePredictions;


    /* =================================================
       SYMPTOM DISEASE DISTRIBUTION
    ================================================= */

    const symptomDistribution = {
      "Dental Caries": 0,
      Gingivitis: 0,
      Healthy: 0,
      "Oral Thrush": 0,
      "Oral Ulcer": 0,
      Periodontitis: 0,
    };


    symptomDistributionRaw.forEach(
      (item) => {
        const predictionName =
          item?._id;

        if (
          Object.prototype.hasOwnProperty.call(
            symptomDistribution,
            predictionName
          )
        ) {
          symptomDistribution[
            predictionName
          ] =
            Number(
              item.count
            ) || 0;
        }
      }
    );


    /* =================================================
       IMAGE CLASS DISTRIBUTION
    ================================================= */

    const imageDistribution = {
      calculus: 0,
      gingivitis: 0,
      hypodontia: 0,
    };


    imageDistributionRaw.forEach(
      (item) => {
        const predictionName =
          item?._id;

        if (
          Object.prototype.hasOwnProperty.call(
            imageDistribution,
            predictionName
          )
        ) {
          imageDistribution[
            predictionName
          ] =
            Number(
              item.count
            ) || 0;
        }
      }
    );


    /* =================================================
       RESPONSE
    ================================================= */

    return res.status(200).json({
      success: true,

      summary: {
        symptomPredictions,
        imagePredictions,
        totalPredictions,
      },

      distributions: {
        symptom:
          symptomDistribution,

        image:
          imageDistribution,
      },

      services: {
        symptomPrediction:
          "connected",

        imagePrediction:
          "connected",
      },
    });
  } catch (error) {
    console.error(
      "Get prediction summary error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to retrieve prediction statistics.",
    });
  }
};


/* =====================================================
   GET ADMIN SETTINGS
===================================================== */

/**
 * GET /api/admin/settings
 *
 * Return the current administrator settings.
 */
exports.getAdminSettings = async (
  req,
  res
) => {
  try {
    const adminId =
      req.user?._id ||
      req.user?.id;

    if (
      !adminId ||
      !mongoose.Types.ObjectId.isValid(
        adminId
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Administrator authentication is required.",
      });
    }

    const admin =
      await User.findOne({
        _id: adminId,
        role: "admin",
      }).select(
        "fullName email role isActive profileImage"
      );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          "Administrator account was not found.",
      });
    }

    return res.status(200).json({
      success: true,

      settings: {
        siteName:
          "OralVista System",

        adminEmail:
          admin.email,
      },

      admin,
    });
  } catch (error) {
    console.error(
      "Get admin settings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve administrator settings.",
    });
  }
};


/* =====================================================
   UPDATE ADMIN SETTINGS
===================================================== */

/**
 * PATCH /api/admin/settings
 *
 * Update the administrator email.
 */
exports.updateAdminSettings =
  async (req, res) => {
    try {
      const adminId =
        req.user?._id ||
        req.user?.id;


      const {
        adminEmail,
      } = req.body;


      if (
        !adminId ||
        !mongoose.Types.ObjectId.isValid(
          adminId
        )
      ) {
        return res.status(401).json({
          success: false,

          message:
            "Administrator authentication is required.",
        });
      }


      if (
        typeof adminEmail !==
          "string" ||
        !adminEmail.trim()
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Administrator email is required.",
        });
      }


      const normalizedEmail =
        adminEmail
          .trim()
          .toLowerCase();


      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailPattern.test(
          normalizedEmail
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Please enter a valid email address.",
        });
      }


      /* =================================================
         CHECK DUPLICATE EMAIL
      ================================================= */

      const duplicateUser =
        await User.findOne({
          email:
            normalizedEmail,

          _id: {
            $ne: adminId,
          },
        });


      if (duplicateUser) {
        return res.status(409).json({
          success: false,

          message:
            "This email address is already being used by another account.",
        });
      }


      /* =================================================
         UPDATE ADMIN EMAIL
      ================================================= */

      const admin =
        await User.findOneAndUpdate(
          {
            _id:
              adminId,

            role:
              "admin",
          },

          {
            email:
              normalizedEmail,
          },

          {
            new: true,
            runValidators: true,
          }
        ).select(
          "fullName email role isActive profileImage"
        );


      if (!admin) {
        return res.status(404).json({
          success: false,

          message:
            "Administrator account was not found.",
        });
      }


      return res.status(200).json({
        success: true,

        message:
          "Administrator email updated successfully.",

        settings: {
          siteName:
            "OralVista System",

          adminEmail:
            admin.email,
        },

        user:
          admin,
      });
    } catch (error) {
      console.error(
        "Update admin settings error:",
        error
      );


      if (
        error.code ===
        11000
      ) {
        return res.status(409).json({
          success: false,

          message:
            "This email address is already being used.",
        });
      }


      return res.status(500).json({
        success: false,

        message:
          "Unable to update administrator settings.",
      });
    }
  };
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =====================================================
   CREATE JWT TOKEN
===================================================== */

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

/* =====================================================
   FORMAT USER RESPONSE
   Never return the password to the frontend
===================================================== */

const formatUserResponse = (user) => {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    isActive: user.isActive,
    profileImage: user.profileImage || "",
    language: user.language || "English",
    notificationsEnabled:
      user.notificationsEnabled ?? true,
    theme: user.theme || "Light",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/* =====================================================
   REGISTER PATIENT
   POST /api/auth/register
===================================================== */

const registerPatient = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, email, password and confirm password are required.",
      });
    }

    if (fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid full name.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password do not match.",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account already exists with this email. Please sign in.",
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone:
        typeof phone === "string"
          ? phone.trim()
          : "",
      password,
      role: "patient",
      isActive: true,
    });

    /*
     * The registration page redirects to login.
     * A token is still returned, but the frontend does not need
     * to save it during registration.
     */
    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please sign in using your registered email and password.",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error(
      "Patient registration error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account already exists with this email.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to register your account.",
    });
  }
};

/* =====================================================
   PATIENT LOGIN
   POST /api/auth/login
===================================================== */

const loginPatient = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    if (
      confirmPassword !== undefined &&
      password !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password do not match.",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      role: "patient",
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Incorrect email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is currently blocked. Please contact the administrator.",
      });
    }

    const passwordIsCorrect =
      await user.comparePassword(password);

    if (!passwordIsCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Incorrect email or password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message:
        "Patient login successful.",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error(
      "Patient login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to sign in to your account.",
    });
  }
};

/* =====================================================
   ADMIN LOGIN
   POST /api/auth/admin/login
===================================================== */

const loginAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Administrator email and password are required.",
      });
    }

    if (
      confirmPassword !== undefined &&
      password !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirm password do not match.",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const admin = await User.findOne({
      email: normalizedEmail,
      role: "admin",
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message:
          "Incorrect administrator email or password.",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message:
          "The administrator account is inactive.",
      });
    }

    const passwordIsCorrect =
      await admin.comparePassword(password);

    if (!passwordIsCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Incorrect administrator email or password.",
      });
    }

    const token = createToken(admin);

    return res.status(200).json({
      success: true,
      message:
        "Administrator login successful.",
      token,
      user: formatUserResponse(admin),
    });
  } catch (error) {
    console.error(
      "Administrator login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to sign in as administrator.",
    });
  }
};

/* =====================================================
   GET CURRENT LOGGED-IN USER
   GET /api/auth/me
===================================================== */

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User account was not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to retrieve the current user.",
    });
  }
};

module.exports = {
  registerPatient,
  loginPatient,
  loginAdmin,
  getCurrentUser,
};
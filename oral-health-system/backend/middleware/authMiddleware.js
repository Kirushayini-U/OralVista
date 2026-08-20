const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Verify that the request contains a valid JWT.
 */
exports.protect = async (req, res, next) => {
  try {
    const authorizationHeader =
      req.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token was not provided.",
      });
    }

    const token = authorizationHeader
      .slice(7)
      .trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token was not provided.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from the .env file."
      );

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration is incomplete.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const userId =
      decoded.id ||
      decoded.userId ||
      decoded._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "The authentication token is invalid.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "The account connected to this token no longer exists.",
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
     * Attach the authenticated user to the request.
     * Controllers can access req.user._id,
     * req.user.role, req.user.email, etc.
     */
    req.user = user;

    return next();
  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error.message
    );

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message:
          "Your login session has expired. Please sign in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message:
          "The authentication token is invalid.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Authentication could not be completed.",
    });
  }
};

/**
 * Restrict a route to specified roles.
 *
 * Example:
 * router.get(
 *   "/admin-data",
 *   protect,
 *   allowRoles("admin"),
 *   controller
 * );
 */
exports.allowRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication is required.",
      });
    }

    if (
      !allowedRoles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to access this resource.",
      });
    }

    return next();
  };
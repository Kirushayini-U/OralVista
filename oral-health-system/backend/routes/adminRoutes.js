const express =
  require("express");

const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserStatus,
  getPredictionSummary,
  getAdminSettings,
  updateAdminSettings,
} = require(
  "../controllers/adminController"
);

const {
  protect,
  allowRoles,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


/*
 * Every route below requires:
 *
 * 1. A valid JWT token
 * 2. The admin role
 */
router.use(protect);
router.use(
  allowRoles("admin")
);


/* =====================================================
   AI PREDICTION STATISTICS
===================================================== */

/*
 * GET /api/admin/prediction-summary
 *
 * Returns:
 *
 * symptom prediction count
 * image prediction count
 * total prediction count
 */
router.get(
  "/prediction-summary",
  getPredictionSummary
);


/* =====================================================
   ADMINISTRATOR SETTINGS
===================================================== */

router.get(
  "/settings",
  getAdminSettings
);

router.patch(
  "/settings",
  updateAdminSettings
);


/* =====================================================
   PATIENT USER MANAGEMENT
===================================================== */

router.get(
  "/users",
  getAllUsers
);

router.get(
  "/users/:id",
  getUserById
);

router.delete(
  "/users/:id",
  deleteUser
);

router.patch(
  "/users/:id/status",
  updateUserStatus
);


module.exports =
  router;
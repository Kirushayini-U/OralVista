const express = require("express");

const {
  searchClinics,
  getMyClinicSearchHistory,
  getAdminClinicSearches,
  getAdminClinicSearchById,
} = require(
  "../controllers/clinicController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

/*
 * Every clinic endpoint requires
 * a valid OralVista JWT.
 */
router.use(protect);

/* =====================================================
   PATIENT ROUTES
===================================================== */

router.post(
  "/search",
  searchClinics
);

router.get(
  "/my-history",
  getMyClinicSearchHistory
);

/* =====================================================
   ADMIN ROUTES
===================================================== */

router.get(
  "/admin/searches",
  getAdminClinicSearches
);

router.get(
  "/admin/searches/:id",
  getAdminClinicSearchById
);

module.exports = router;
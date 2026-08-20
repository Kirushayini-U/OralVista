const express = require("express");

const {
  registerPatient,
  loginPatient,
  loginAdmin,
  getCurrentUser,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/admin/login", loginAdmin);
router.get("/me", protect, getCurrentUser);

module.exports = router;
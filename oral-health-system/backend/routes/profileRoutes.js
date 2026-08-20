const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
} = require("../controllers/profileController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * Both administrators and patients can access
 * their own profile and change their password.
 *
 * Do not add:
 * allowRoles("patient")
 *
 * because that would block administrator accounts.
 */
router.use(protect);

router.get(
  "/me",
  getMyProfile
);

router.patch(
  "/me",
  updateMyProfile
);

router.patch(
  "/change-password",
  changeMyPassword
);

module.exports = router;
const express = require("express");

const newsletterController = require(
  "../controllers/newsletterController"
);

const {
  protect,
  allowRoles,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

/* =====================================================
   CONTROLLER FUNCTIONS
===================================================== */

const {
  createNewsletter,
  getAdminNewsletters,
  getNewsletterById,
  updateNewsletter,
  publishNewsletter,
  sendNewsletter,
  deleteNewsletter,
  getPublishedNewsletters,
  getSubscriptionStatus,
  updateSubscriptionStatus,
} = newsletterController;

/* =====================================================
   STARTUP VALIDATION
===================================================== */

/*
 * This gives a clear error when a controller function
 * is missing or exported using a different name.
 */
const requiredControllers = {
  createNewsletter,
  getAdminNewsletters,
  getNewsletterById,
  updateNewsletter,
  publishNewsletter,
  sendNewsletter,
  deleteNewsletter,
  getPublishedNewsletters,
  getSubscriptionStatus,
  updateSubscriptionStatus,
};

Object.entries(
  requiredControllers
).forEach(([name, handler]) => {
  if (typeof handler !== "function") {
    throw new TypeError(
      `Newsletter controller "${name}" is missing or is not exported correctly.`
    );
  }
});

/* =====================================================
   PATIENT NEWSLETTER ROUTES
===================================================== */

/*
 * Get newsletters published by the administrator.
 */
router.get(
  "/published",
  protect,
  allowRoles("patient"),
  getPublishedNewsletters
);

/*
 * Get the logged-in patient's subscription status.
 */
router.get(
  "/subscription",
  protect,
  allowRoles("patient"),
  getSubscriptionStatus
);

/*
 * Subscribe or unsubscribe the logged-in patient.
 */
router.patch(
  "/subscription",
  protect,
  allowRoles("patient"),
  updateSubscriptionStatus
);

/* =====================================================
   ADMIN NEWSLETTER ROUTES
===================================================== */

/*
 * Get all newsletter campaigns.
 */
router.get(
  "/admin",
  protect,
  allowRoles("admin"),
  getAdminNewsletters
);

/*
 * Create a newsletter draft.
 */
router.post(
  "/admin",
  protect,
  allowRoles("admin"),
  createNewsletter
);

/*
 * Get one newsletter by ID.
 */
router.get(
  "/admin/:id",
  protect,
  allowRoles("admin"),
  getNewsletterById
);

/*
 * Edit an existing newsletter.
 */
router.patch(
  "/admin/:id",
  protect,
  allowRoles("admin"),
  updateNewsletter
);

/*
 * Delete a newsletter.
 */
router.delete(
  "/admin/:id",
  protect,
  allowRoles("admin"),
  deleteNewsletter
);

/*
 * Publish a draft newsletter.
 */
router.patch(
  "/admin/:id/publish",
  protect,
  allowRoles("admin"),
  publishNewsletter
);

/*
 * Send a published newsletter to subscribed patients.
 */
router.post(
  "/admin/:id/send",
  protect,
  allowRoles("admin"),
  sendNewsletter
);

module.exports = router;
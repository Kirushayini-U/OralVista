const express = require("express");

const {
  sendChatMessage,
} = require("../controllers/chatController");

const {
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
 * Only authenticated patients or admins
 * can use the AI assistant.
 */
router.post(
  "/message",
  protect,
  sendChatMessage
);

module.exports = router;
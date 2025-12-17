// routes/messageRoutes.js
const express = require("express");
const auth = require("../middleware/auth");
const { getInbox, getMessages, sendMessage, markAsSeen, deleteMessage } = require("../controller/message");


const router = express.Router();

router.get("/inbox", auth, getInbox);
router.get("/:username", auth, getMessages);
router.post("/:username", auth, sendMessage);
router.put("/seen/:userId", auth, markAsSeen);
router.delete("/:id", auth, deleteMessage);

module.exports = router;

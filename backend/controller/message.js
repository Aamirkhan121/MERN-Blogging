// controllers/messageController.js
const Message = require("../module/message")
const User = require("../module/usermodule");


/* =====================================================
   1️⃣ GET MESSAGES (1-to-1 chat by username)
===================================================== */
exports.getMessages = async (req, res) => {
  try {
    const receiver = await User.findOne({ username: req.params.username });

    if (!receiver)
      return res.status(404).json({ message: "User not found" });

    const messages = await Message.find({
        isDeleted: false,
      $or: [
        { sender: req.user._id, receiver: receiver._id },
        { sender: receiver._id, receiver: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username profilePic")
      .populate("receiver", "username profilePic");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   2️⃣ SEND MESSAGE (REST – optional, socket main hai)
===================================================== */
exports.sendMessage = async (req, res) => {
  try {
    const { username } = req.params;
    const { text } = req.body;

     if (!text || text.trim() === "")
      return res.status(400).json({ message: "Message cannot be empty" });

    const receiver = await User.findOne({ username });

    if (!receiver)
      return res.status(404).json({ message: "User not found" });

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiver._id,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   3️⃣ GET INBOX (Chat list like Instagram)
===================================================== */
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
            isDeleted: false,
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", req.user._id] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
    ]);

    await User.populate(messages, {
      path: "_id",
      select: "username profilePic",
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   4️⃣ MARK MESSAGES AS SEEN
===================================================== */
exports.markAsSeen = async (req, res) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.userId,
        receiver: req.user._id,
        seen: false,
      },
      { seen: true }
    );

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   5️⃣ DELETE MESSAGE (Optional)
===================================================== */
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message)
      return res.status(404).json({ message: "Message not found" });

    if (message.sender.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not allowed" });

    await message.deleteOne();
    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

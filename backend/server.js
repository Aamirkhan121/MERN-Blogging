require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");

const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoute");
const messageRoute = require("./routes/messageRoute");
const Message = require("./module/message");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

/* ===================== MIDDLEWARE ===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => res.send("API is running..."));

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/messages", messageRoute);

/* ===================== SOCKET.IO ===================== */

const onlineUsers = new Map();

// JWT auth for socket
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    socket.userId = decoded.id;
    next();
  } catch (error) {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.userId);

  // Track online users
  onlineUsers.set(socket.userId, socket.id);
  io.emit("onlineUsers", Array.from(onlineUsers.keys()));

  // Send message
  socket.on("sendMessage", async ({ receiverId, text }) => {
    try {
      if (!receiverId || !text) {
        console.log("Receiver ID or text missing");
        return;
      }

      const message = await Message.create({
        sender: socket.userId,
        receiver: receiverId,
        text,
      });

      // Emit to receiver
      const receiverSocket = onlineUsers.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("newMessage", message);
      }

      // Ack to sender
socket.emit("newMessage", message);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  });

  // Typing indicator
  socket.on("typing", ({ receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("typing", socket.userId);
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) io.to(receiverSocket).emit("stopTyping");
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.userId);
    onlineUsers.delete(socket.userId);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

/* ===================== DB + SERVER ===================== */
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`🚀 Server + Socket running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

/* ===================== ERROR HANDLER ===================== */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

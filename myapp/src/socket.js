import { io } from "socket.io-client";

const socket = io("https://mern-blog-api-49y4.onrender.com", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

// socket.on("connect", () => {
//   console.log("Connected to socket server:", socket.id);
// });

// socket.on("newMessage", (message) => {
//   console.log("New message received:", message);
// });

// socket.on("onlineUsers", (users) => {
//   console.log("Online users:", users);
// });

export default socket;
// socket.on("disconnect", () => {
//   console.log("Disconnected from socket server");
// });
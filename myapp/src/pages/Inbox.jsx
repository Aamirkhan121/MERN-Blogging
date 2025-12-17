import { useEffect, useState } from "react";
import axios from "../utils/instance";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

export default function Inbox() {
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  const currentUserId = JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    // Fetch inbox chats from backend
    const fetchInbox = async () => {
      try {
        const res = await axios.get("/messages/inbox");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to fetch inbox:", err);
      }
    };

    fetchInbox();

    // Socket listener for online users
    const handleOnlineUsers = (users) => setOnlineUsers(users);
    socket.on("onlineUsers", handleOnlineUsers);

    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white h-screen">
      <h2 className="text-xl font-bold p-4 border-b">Messages</h2>

      {chats.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No messages yet</p>
      )}

      {chats.map((chat) => {
  const user = chat._id; // 👈 correct
  const isOnline = onlineUsers.includes(user._id);
        return (
          <div
            key={user._id}
            onClick={() => navigate(`/chat/${user.username}`)}
            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100"
          >
            <div className="relative">
              <img
                src={user.profilePic || "/default-profile.png"}
                alt={user.username}
                className="w-12 h-12 rounded-full"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>

            <div className="flex-1">
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage?.text || "No messages yet"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

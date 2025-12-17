import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/instance";
import socket from "../socket";

export default function InboxDropdown() {
  const [open, setOpen] = useState(false);
  const [inbox, setInbox] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  // Load inbox from DB (reload safe)
  useEffect(() => {
    if (!user) return;

    const loadInbox = async () => {
      try {
        const res = await axios.get("/messages/inbox");
        setInbox(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadInbox();
  }, [user]);

  // Real-time update (socket)
  useEffect(() => {
  if (!user) return;

  const updateInbox = (msg) => {
    const myId = user._id;

    // Find other user (chat partner)
    const otherUser =
      msg.sender._id === myId ? msg.receiver : msg.sender;

    setInbox((prev) => {
      // Remove old entry if exists
      const filtered = prev.filter(
        (chat) => chat._id._id !== otherUser._id
      );

      // Add updated chat on top
      return [
        {
          _id: otherUser,       // user object
          lastMessage: msg,
        },
        ...filtered,
      ];
    });
  };

  // 🔥 Receiver
  socket.on("newMessage", updateInbox);

  // 🔥 Sender (instant update)
  socket.on("messageSent", updateInbox);

  return () => {
    socket.off("newMessage", updateInbox);
    socket.off("messageSent", updateInbox);
  };
}, [user]);


  if (!user) return null;

  return (
    <div className="relative">
      {/* Message Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="text-2xl text-gray-700 hover:text-green-600"
      >
        💬
      </button>

      {/* Inbox Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg max-h-96 overflow-y-auto z-50">
          {inbox.length === 0 && (
            <p className="p-4 text-gray-500 text-sm">
              No conversations yet
            </p>
          )}

          {inbox.map((chat) => (
            <Link
              key={chat._id._id}
              to={`/chat/${chat._id.username}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
            >
              <img
                src={chat._id.profilePic || "/default-avatar.png"}
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1">
                <p className="font-medium">
                  {chat._id.username}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage.text}
                </p>
              </div>

              {!chat.lastMessage.seen && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

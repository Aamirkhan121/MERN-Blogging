import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlusSquare, FiMessageSquare } from "react-icons/fi";
import socket from "../socket";
import axios from "../utils/instance";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ================= FETCH INBOX ================= */
  useEffect(() => {
    if (!user) return;

    const fetchInbox = async () => {
      try {
        const res = await axios.get("/messages/inbox");
        setInbox(res.data);

        const unread = res.data.filter(
          (c) =>
            !c.lastMessage.seen &&
            c.lastMessage.sender !== user._id
        ).length;

        setUnreadCount(unread);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInbox();
  }, [user]);

  /* ================= SOCKET REALTIME ================= */
  useEffect(() => {
    if (!user) return;

    const handleNewMessage = (msg) => {
      const otherUser =
        msg.sender._id === user._id ? msg.receiver : msg.sender;

      setInbox((prev) => {
        const filtered = prev.filter(
          (c) => c._id._id !== otherUser._id
        );

        return [
          { _id: otherUser, lastMessage: msg },
          ...filtered,
        ];
      });

      if (msg.sender._id !== user._id) {
        setUnreadCount((c) => c + 1);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [user]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/K_T_Logo.png" className="w-10 h-10" />
            <span className="text-2xl font-bold text-green-600">
              MyBlog
            </span>
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/">Home</Link>

            {user && (
              <>
                <Link to="/create-post" className="text-2xl">
                  <FiPlusSquare />
                </Link>

                {/* INBOX */}
                <div className="relative">
                  <button
                    onClick={() => setInboxOpen(!inboxOpen)}
                    className="text-2xl relative"
                  >
                    <FiMessageSquare />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {inboxOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border rounded shadow-lg max-h-80 overflow-y-auto">
                      {inbox.length === 0 && (
                        <p className="p-4 text-gray-500">No messages</p>
                      )}

                      {inbox.map((chat) => (
                        <Link
                          key={chat._id._id}
                          to={`/chat/${chat._id.username}`}
                          onClick={() => {
                            setInboxOpen(false);
                            setUnreadCount(0);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                        >
                          <img
                            src={chat._id.profilePic || "/default-avatar.png"}
                            className="w-9 h-9 rounded-full"
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

                {/* PROFILE */}
                <button onClick={() => setMenuOpen(!menuOpen)}>
                  <img
                    src={user.profilePic || "/default-avatar.png"}
                    className="w-8 h-8 rounded-full"
                  />
                </button>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && user && (
        <div className="md:hidden border-t bg-white">
          <Link to="/" className="block px-4 py-2">Home</Link>
          <Link to="/create-post" className="block px-4 py-2">Create</Link>

          {/* MOBILE INBOX */}
          <div className="border-t">
            {inbox.map((chat) => (
              <Link
                key={chat._id._id}
                to={`/chat/${chat._id.username}`}
                className="block px-4 py-2 border-b"
                onClick={() => setMenuOpen(false)}
              >
                {chat._id.username}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

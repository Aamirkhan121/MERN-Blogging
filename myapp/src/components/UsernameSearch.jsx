import { useEffect, useRef, useState } from "react";
import axios from "../utils/instance";
import { useNavigate } from "react-router-dom";

export default function UsernameSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const boxRef = useRef();

  // 🔍 Debounced search
  useEffect(() => {
    if (!query.trim()) return setUsers([]);

    const timer = setTimeout(async () => {
      const res = await axios.get(`/users/search?query=${query}`);
      setUsers(res.data);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // ⌨️ Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % users.length);
    }
    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + users.length) % users.length);
    }
    if (e.key === "Enter" && activeIndex >= 0) {
      navigate(`/profile/${users[activeIndex].username}`);
      setUsers([]);
    }
  };

  // ✨ Highlight matched text
  const highlightText = (text) => {
    const regex = new RegExp(`(${query})`, "ig");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-blue-600 font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-sm mx-auto" ref={boxRef}>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {users.length > 0 && (
        <div className="absolute top-12 w-full bg-white border rounded-xl shadow-lg z-50">
          {users.map((user, i) => (
            <div
              key={user._id}
              onClick={() => navigate(`/profile/${user.username}`)}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer
                ${i === activeIndex ? "bg-gray-100" : ""}`}
            >
              <img
                src={user.profilePic || "/default-avatar.png"}
                className="w-8 h-8 rounded-full object-cover"
              />
              <p>{highlightText(user.username)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import socket from "../socket";

export default function ChatInput({ receiver }) {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim() || !receiver?._id) return;

    socket.emit("sendMessage", {
      receiverId: receiver._id,
      text,
    });

    setText(""); // clear input
  };

  const handleChange = (e) => {
    setText(e.target.value);
    socket.emit("typing", { receiverId: receiver._id });
  };

  const handleBlur = () => {
    socket.emit("stopTyping", { receiverId: receiver._id });
  };

  return (
    <div className="p-3 border-t flex gap-2">
      <input
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Message..."
        className="flex-1 border rounded-full px-4 py-2"
      />
      <button
        onClick={sendMessage}
        className="bg-green-600 text-white px-4 rounded-full"
      >
        Send
      </button>
    </div>
  );
}

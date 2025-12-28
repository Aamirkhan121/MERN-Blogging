import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/instance";
import socket from "../socket";
import ChatInput from "../components/ChatInput";

export default function Chat() {
  const { username } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [receiver, setReceiver] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchReceiverAndMessages = async () => {
      try {
        const res = await axios.get(`/users/profile/${username}`);
        setReceiver(res.data.user);

        const msgRes = await axios.get(`/messages/${username}`);
        setMessages(msgRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReceiverAndMessages();
  }, [username]);

  // Scroll to bottom smoothly
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket.io events
  useEffect(() => {
    if (!receiver) return;

    const myId = user._id;

    const handleNewMessage = (msg) => {
      const senderId = msg.sender?._id || msg.sender;
      const receiverId = msg.receiver?._id || msg.receiver;

      const isCurrentChat =
        (senderId === myId && receiverId === receiver._id) ||
        (senderId === receiver._id && receiverId === myId);

      if (isCurrentChat) setMessages((prev) => [...prev, msg]);
    };

    const handleTyping = (userId) => {
      if (userId === receiver._id) setTyping(true);
    };

    const handleStopTyping = () => setTyping(false);

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [receiver]);

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[80vh] border rounded-2xl shadow-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 shadow-sm">
        <h2 className="font-bold text-lg">{receiver?.username}</h2>
        <span
          className={`text-sm font-medium ${
            receiver?.online ? "text-green-500" : "text-gray-400"
          }`}
        >
          {receiver?.online ? "Online" : "Offline"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
        {messages.map((m) => {
          const senderId = m.sender?._id || m.sender;
          const isMe = senderId === user._id;
          return (
            <div
              key={m._id}
              className={`p-3 rounded-2xl max-w-[70%] break-words shadow-sm transition-all duration-200 ${
                isMe
                  ? "self-end bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "self-start bg-white text-gray-800 border"
              }`}
            >
              {m.text}
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typing && (
          <div className="self-start flex items-center gap-2">
            <span className="text-gray-500 text-sm">Typing</span>
            <span className="flex gap-1">
              <span className="animate-bounce w-2 h-2 bg-gray-500 rounded-full"></span>
              <span className="animate-bounce w-2 h-2 bg-gray-500 rounded-full delay-150"></span>
              <span className="animate-bounce w-2 h-2 bg-gray-500 rounded-full delay-300"></span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gray-100">
        <ChatInput receiver={receiver} />
      </div>
    </div>
  );
}


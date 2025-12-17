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

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket.io events
  useEffect(() => {
  if (!receiver) return;

  const myId = JSON.parse(localStorage.getItem("user"))._id;

  const handleNewMessage = (msg) => {
    const senderId = msg.sender?._id || msg.sender;
    const receiverId = msg.receiver?._id || msg.receiver;

    const isCurrentChat =
      (senderId === myId && receiverId === receiver._id) ||
      (senderId === receiver._id && receiverId === myId);

    if (isCurrentChat) {
      setMessages((prev) => [...prev, msg]);
    }
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
    <div className="max-w-3xl mx-auto flex flex-col h-[80vh] border rounded shadow">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold">{receiver?.username}</h2>
        <span className="text-sm text-gray-500">
          {receiver?.online ? "Online" : "Offline"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
       {messages.map((m) => {
  const senderId = m.sender?._id || m.sender;

  return (
    <div
      key={m._id}
      className={`p-2 rounded max-w-[70%] ${
        senderId === user._id
          ? "self-end bg-green-500 text-white"
          : "self-start bg-gray-200"
      }`}
    >
      {m.text}
    </div>
  );
})}
        {typing && <p className="text-sm text-gray-500">Typing...</p>}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <ChatInput receiver={receiver} />
    </div>
  );
}

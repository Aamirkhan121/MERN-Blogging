export default function MessageBubble({ msg, own }) {
  return (
    <div className={`flex ${own ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-xs ${
          own ? "bg-green-600 text-white" : "bg-gray-200"
        }`}
      >
        <p>{msg.text}</p>

        {own && (
          <p className="text-xs text-right mt-1">
            {msg.seen ? "✔✔" : "✔"}
          </p>
        )}
      </div>
    </div>
  );
}

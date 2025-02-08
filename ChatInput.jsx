import React, { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSend(query);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="Ask a question..."
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Ask
      </button>
    </form>
  );
};

export default ChatInput;

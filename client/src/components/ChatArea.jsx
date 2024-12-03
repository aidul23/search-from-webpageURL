import { FaArrowUp } from "react-icons/fa";
import React, { useState } from "react";
import axios from "axios";

const ChatArea = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (query.trim() === "") return;

    // Add user message to the chat
    const newMessage = { sender: "user", text: query };
    setMessages([...messages, newMessage]);

    // Clear the input field and set loading
    setQuery("");
    setLoading(true);

    try {
      // Make API call to the backend
      const response = await axios.post(
        "http://localhost:3001/api/embedding/query-embedding",
        {
          query,
        }
      );

      // Add AI's response to the chat
      const aiResponse = {
        sender: "ai",
        text: response.data.answer || "No response received.",
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        sender: "ai",
        text: "Error fetching response. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
            style={{ maxWidth: "75%" }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div
            className="my-2 p-3 rounded-lg bg-gray-200 text-black self-start"
            style={{ maxWidth: "75%" }}
          >
          🤔 Thinking...
          </div>
        )}
      </div>

      {/* Query Input */}
      <form onSubmit={handleSend} className="flex">
        <input
          type="text"
          placeholder="Type your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg flex items-center justify-center space-x-2"
          disabled={loading}
        >
          <FaArrowUp className="text-white" />
          <span>{loading ? "Sending..." : "Send"}</span>
        </button>
      </form>
    </div>
  );
};

export default ChatArea;

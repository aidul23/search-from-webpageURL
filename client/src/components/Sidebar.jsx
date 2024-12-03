import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const Sidebar = ({ onSubmitUrl }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call the API to store the URL embedding
      await axios.post("http://localhost:3001/api/embedding/document", { url });
      setMessage("URL successfully processed and stored.");
      setUrl(""); // Clear the input field
      onSubmitUrl(url); // Notify the parent component
    } catch (error) {
      console.error(error);
      setMessage("Error processing the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/4 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-xl font-semibold mb-4">URL Input</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white focus:outline-none"
          required
          disabled={loading} // Disable input during loading
        />
        <button
          type="submit"
          className={`py-2 rounded text-white font-bold flex items-center justify-center space-x-2 ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading} // Disable button during loading
        >
          {loading ? (
            <span>Processing...</span>
          ) : (
            <>
              <FaPlus />
              <span>Add URL</span>
            </>
          )}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-sm ${
            message.includes("successfully")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Sidebar;

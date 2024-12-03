import React, { useState } from "react";
import axios from "axios";

const QueryForm = ({ setResponse }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/embedding/query-embedding",
        { query }
      );
      setResponse(data.answer || "No response found.");
    } catch (error) {
      console.error(error);
      setResponse("Error fetching the response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Query the Database</h2>
      <form onSubmit={handleQuery}>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Enter your query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default QueryForm;

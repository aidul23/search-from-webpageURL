import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

const Sidebar = ({ onSubmitUrl }) => {
  const [url, setUrl] = useState("");
  const [fileName, setfileName] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch all uploaded URLs when the component mounts
    fetchUploadedDocs();
  }, []);

  const fetchUploadedDocs = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/embedding/getAll-docs");
      setUploadedDocs(response.data.documents);
    } catch (error) {
      console.error("Error fetching uploaded URLs:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Call the API to store the URL embedding
      await axios.post("http://localhost:3001/api/embedding/document", { url, fileName });
      setMessage("URL successfully processed and stored.");

      setUploadedDocs((prevUrls) => [
        { fileName, url }, // Add the new document to the list
        ...prevUrls, // Include existing documents
      ]);


      setUrl(""); // Clear the input field
      setfileName("");
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
        <input
          type="docName"
          placeholder="Give a Name to the URL document!"
          value={fileName}
          onChange={(e) => setfileName(e.target.value)}
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

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Uploaded URLs</h3>
        <ul className="space-y-2">
          {uploadedDocs.map((item, index) => (
            <li
              key={index}
              className="p-2 bg-gray-700 rounded text-sm flex flex-col"
            >
              <span className="font-bold">{item.fileName}</span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline mt-1"
              >
                {item.url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

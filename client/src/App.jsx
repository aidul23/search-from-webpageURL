import React, { useState } from "react";
import Navbar from "./components/Navbar";
import URLForm from "./components/URLForm";
import QueryForm from "./components/QueryForm";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import axios from "axios";


const App = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle URL submission (you can process the URL here if needed)
  const handleUrlSubmit = async (submittedUrl) => {
    console.log("URL Submitted:", submittedUrl);
    setUrl(submittedUrl); // Save the URL for use in other parts of the app
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for URL input */}
      <Sidebar onSubmitUrl={handleUrlSubmit} />

      {/* Chat Area for conversation */}
      <ChatArea />
    </div>
  );
};

export default App;

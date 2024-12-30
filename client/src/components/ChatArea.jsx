import axios from "axios";
import React, { useRef, useState, useCallback } from "react";
import { FaArrowUp, FaMicrophone, FaStop } from "react-icons/fa";

const ChatArea = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (query.trim() === "") return;
    await sendMessage(query);
    setQuery("");
  };

  const sendMessage = async (text) => {
    const newMessage = { sender: "user", text };
    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/embedding/query-embedding",
        { query: text }
      );

      const aiResponse = {
        sender: "ai",
        text: response.data.answer || "No response received.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error fetching response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Failed to access microphone. Please check your permissions.");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise((resolve) => {
      mediaRecorderRef.current.onstop = async () => {
        if (audioChunksRef.current.length === 0) {
          console.log("No audio data available");
          resolve(null);
          return;
        }

        const blob = new Blob(audioChunksRef.current, { type: "audio/m4a" });
        if (blob.size === 0) {
          console.log("Audio blob is empty");
          resolve(null);
          return;
        }

        resolve(blob);
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
    });
  }, []);

  const handleRecordingToggle = useCallback(async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        await sendAudioMessage(audioBlob);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Audio recording failed. Please try again." },
        ]);
      }
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const sendAudioMessage = async (audioBlob) => {
    setMessages((prev) => [...prev, { sender: "user", text: "🎤 Audio Message" }]);
    setLoading(true);

    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.m4a");

    try {
      // First, get the transcription
      const transcriptionResponse = await axios.post(
        "http://localhost:3001/api/embedding/audio-query",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const transcription = transcriptionResponse.data.transcription || "No transcription available.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `📝 Transcription: ${transcription}`,
        },
      ]);

      // Now, use the transcription to query the embedding API
      const embeddingResponse = await axios.post(
        "http://localhost:3001/api/embedding/query-embedding",
        { query: transcription }
      );

      const aiResponse = embeddingResponse.data.answer || "No response received.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiResponse,
        },
      ]);
    } catch (error) {
      console.error("Error processing audio or fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error processing audio or fetching response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 bg-white">
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
          <div className="my-2 p-3 rounded-lg bg-gray-200 text-black self-start" style={{ maxWidth: "75%" }}>
            🤔 Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex">
        <input
          type="text"
          placeholder="Type your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none"
          disabled={loading || isRecording}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg flex items-center justify-center space-x-2"
          disabled={loading || isRecording}
        >
          <FaArrowUp className="text-white" />
          <span>{loading ? "Sending..." : "Send"}</span>
        </button>
      </form>

      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={handleRecordingToggle}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}
          disabled={loading}
        >
          {isRecording ? <FaStop /> : <FaMicrophone />}
          <span>{isRecording ? "Stop" : "Ask"}</span>
        </button>
      </div>
    </div>
  );
};

export default ChatArea;

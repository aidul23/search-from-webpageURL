import React, { useState } from 'react';
import axios from 'axios';

const URLForm = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:3001/api/embedding/document', { url });
      setMessage('URL successfully processed and stored.');
      setUrl('');
    } catch (error) {
      console.error(error);
      setMessage('Error processing the URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4">Add Webpage URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Enter webpage URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
};

export default URLForm;

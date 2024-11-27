'use client';

import { useState } from 'react';

export default function JsonUploadPage() {
  const [jsonText, setJsonText] = useState('');
  const [archiveName, setArchiveName] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      json_text: jsonText,
      archive_name: archiveName,
    };

    const res = await fetch('/api/save-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <>
      <h1>Upload JSON to Blob Store</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="archiveName">Archive Name:</label>
          <input
            id="archiveName"
            type="text"
            value={archiveName}
            onChange={(e) => setArchiveName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="jsonText">JSON Text:</label>
          <textarea
            id="jsonText"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>
      {response && (
        <div>
          <h2>Response</h2>
          {response.success ? (
            <div>
              Blob URL: <a href={response.blob.url}>{response.blob.url}</a>
            </div>
          ) : (
            <p>Error: {response.error}</p>
          )}
        </div>
      )}
    </>
  );
}

import { useState } from 'react';

export default function Home() {
  const [filename, setFilename] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`/api/blob?filename=${filename}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: content
      });
      const result = await response.json();
      if (response.ok) {
        setMessage(`Archivo guardado con éxito: ${result.url}`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Guardar en Blob Storage</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre del archivo:
          <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} required />
        </label>
        <br />
        <label>
          Contenido del archivo:
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Guardar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

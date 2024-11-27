'use client';

import { useState, useRef } from 'react';

export default function FileUploadPage() {
  const inputFileRef = useRef(null);
  const [blob, setBlob] = useState(null);

  return (
    <>
      <h1>Subir Texto al Blob Store</h1>

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          const file = inputFileRef.current.files[0];
          if (!file) {
            alert("Por favor selecciona un archivo.");
            return;
          }

          // Enviar el archivo al servidor
          const response = await fetch(
            `/api/upload?filename=${file.name}`,
            {
              method: 'POST',
              body: file, // Enviamos el archivo completo como `body`
            }
          );

          // Recibir la respuesta del servidor
          const newBlob = await response.json();
          setBlob(newBlob);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" accept=".txt" required />
        <button type="submit">Subir</button>
      </form>

      {blob && (
        <div>
          <h2>Archivo subido exitosamente</h2>
          <p>URL del Blob:</p>
          <a href={blob.url} target="_blank" rel="noopener noreferrer">{blob.url}</a>
        </div>
      )}
    </>
  );
}

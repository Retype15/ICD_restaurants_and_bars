const express = require('express');
const path = require('path');
const { put } = require('@vercel/blob');

const app = express();
app.use(express.json());

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/save', async (req, res) => {
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).json({ error: 'Filename and content are required' });
    }

    try {
        const { url } = await put(filename, content, { access: 'public', token: blobToken });
        res.status(200).json({ url });
    } catch (error) {
        res.status(500).json({ error: `Error saving file: ${error.message}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const { put } = require('@vercel/blob');
const { URLSearchParams } = require('url');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.post('/save', async (req, res) => {
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).json({ error: 'Filename and content are required' });
    }

    try {
        const blob = await put(filename, content, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
        });
        res.status(200).json(blob);
    } catch (error) {
        res.status(500).json({ error: `Error saving file: ${error.message}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

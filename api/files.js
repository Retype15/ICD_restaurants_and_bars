import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import archiver from 'archiver';
import { PassThrough } from 'stream';

export async function GET(req, res) {
  const path = req.query.path;

  try {
    const response = await list(); // Fetch the list of blobs

    // Validate the response structure
    if (!response || !Array.isArray(response.blobs)) {
      throw new Error('Invalid response from Blob Store: Missing or invalid "blobs" property');
    }

    const blobs = response.blobs.filter(blob => blob.pathname.startsWith(path));
    if (blobs.length === 0) {
      return NextResponse.json({ error: 'No files found in the specified folder' }, { status: 404 });
    }

    const archive = archiver('zip');
    const passThroughStream = new PassThrough();

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${path}.zip"`);

    archive.pipe(passThroughStream);
    passThroughStream.pipe(res);

    for (const blob of blobs) {
      const request = fetch(blob.downloadUrl)
        .then(response => response.buffer())
        .then(buffer => {
          archive.append(buffer, { name: blob.pathname.replace(`${path}/`, '') });
        })
        .catch(error => {
          console.error(`Error fetching blob ${blob.pathname}:`, error);
          throw error;
        });
    }

    archive.finalize();
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error.message },
      { status: 500 }
    );
  }
}

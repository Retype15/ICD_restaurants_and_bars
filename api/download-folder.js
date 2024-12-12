import { list } from '@vercel/blob';
import archiver from 'archiver';
import { NextResponse } from 'next/server';
import { PassThrough } from 'stream';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Path query parameter is missing' }, { status: 400 });
  }

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

    // Set headers for the response
    const headers = new Headers();
    headers.append('Content-Type', 'application/zip');
    headers.append('Content-Disposition', `attachment; filename="${path}.zip"`);

    // Pipe the archive stream to the response stream
    archive.pipe(passThroughStream);

    // Add each blob to the archive
    for (const blob of blobs) {
      const response = await fetch(blob.url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = blob.name.replace(`${path}/`, '');

      // Only append files, not empty folders
      if (fileName) {
        archive.append(buffer, { name: fileName });
      }
    }

    archive.finalize();

    return new Response(passThroughStream, { headers });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error.message },
      { status: 500 }
    );
  }
}

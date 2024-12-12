import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await list(); // Fetch the list of blobs

    // Validate the response structure
    if (!response || !Array.isArray(response.blobs)) {
      throw new Error('Invalid response from Blob Store: Missing or invalid "blobs" property');
    }

    // Map the blobs to extract name and URL
    const files = response.blobs.map(blob => ({
      name: blob.pathname, // Blob name
      url: blob.downloadUrl, // Public URL for downloading the blob
    }));

    return NextResponse.json(files); // Return JSON response with the files
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error.message },
      { status: 500 }
    );
  }
}

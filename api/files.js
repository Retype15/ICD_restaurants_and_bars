import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const blobs = await list();
    const files = blobs.items.map(blob => ({
      name: blob.key,
      url: blob.url,
    }));

    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
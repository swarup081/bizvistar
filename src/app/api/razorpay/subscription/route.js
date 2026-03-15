export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function POST(req) {
  return NextResponse.json({ success: true, message: 'Not implemented directly. Use Server Actions.' });
}

export async function GET(req) {
  return NextResponse.json({ success: true, message: 'API Route Placeholder' });
}

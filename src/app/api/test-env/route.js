export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ 
    apiKey,
    baseURL: process.env.GEMINI_API_KEY ? "https://generativelanguage.googleapis.com/v1beta/openai/" : undefined
  });

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.GEMINI_API_KEY ? "gemini-3.5-flash" : "gpt-4o-mini",
      messages: [{ role: "user", content: "hello" }],
      temperature: 0.7,
      max_tokens: 10,
    });
    return NextResponse.json({ success: true, choice: completion.choices[0] });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack, raw: String(err) });
  }
}

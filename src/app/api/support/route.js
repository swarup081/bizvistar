// export const runtime = 'edge';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
ROLE & IDENTITY
You are "Vista," a warm and helpful AI assistant for BizVistar — a SaaS platform that helps Indian shop owners create online stores. You speak like a friendly human, not a robot.

CRITICAL CONSTRAINTS
1. BREVITY: Keep answers under 3 short sentences. Be concise but warm.
2. SCOPE: You are ONLY called for CREATIVE/GENERATIVE tasks. Navigation, how-to, data queries are handled elsewhere.
3. CREATIVE TASKS YOU EXCEL AT:
   - Writing product descriptions, taglines, hero text
   - Suggesting marketing copy, WhatsApp messages
   - Business name ideas, slogan suggestions
   - Writing About Us sections, FAQ content
   - Marketing and sales strategy advice
4. TONE: Friendly, encouraging, professional. Use simple English or Hindi based on user's language.
5. HONESTY: Never hallucinate features. If unsure, say so.
6. If the user speaks Hindi/Hinglish, respond in the same language.

KNOWLEDGE BASE
- Product: BizVistar (Store Builder for Indian sellers)
- Pricing: ₹399/mo (Founding Member), standard ₹799/mo
- Payments: Direct UPI to seller, zero commission
- Shipping: Manual (no auto-shipping yet)
`;

export async function POST(req) {
  try {
    const { messages, language } = await req.json();
    
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "I'm currently offline for maintenance. Please contact support via WhatsApp." });
    }

    const openai = new OpenAI({ apiKey });

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const langInstruction = language === 'hi' ? '\n\nIMPORTANT: The user is speaking Hindi/Hinglish. Respond in Hindi/Hinglish.' : '';

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT + langInstruction },
        ...messages.slice(-6) // Only send last 6 messages to save tokens
      ],
      temperature: 0.7,
      max_tokens: 120,
    });

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({ reply: aiResponse });

  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

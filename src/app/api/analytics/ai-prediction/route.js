import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function POST(req) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { websiteId } = await req.json();

    if (!websiteId) {
      return NextResponse.json({ error: 'Missing websiteId' }, { status: 400 });
    }

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Check if an insight already exists for this month. We handle errors gracefully just in case the table doesn't exist
    let existingInsight = null;
    try {
      const { data, error: insightError } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('website_id', websiteId)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .maybeSingle();

      if (data) existingInsight = data;
    } catch (e) {
      console.warn("Table ai_insights might not exist yet:", e);
    }

    if (existingInsight && existingInsight.insights) {
      return NextResponse.json({ data: existingInsight.insights });
    }

    // Fetch brief aggregated data to feed to OpenAI
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    const startDateISO = thirtyDaysAgo.toISOString();

    const [ordersRes, productsRes] = await Promise.all([
      supabase
        .from("orders")
        .select("id, total_amount, created_at, status")
        .eq("website_id", websiteId)
        .gte("created_at", startDateISO)
        .neq("status", "canceled"),
      supabase
        .from("products")
        .select("id, name, price, stock")
        .eq("website_id", websiteId)
    ]);

    const orders = ordersRes.data || [];
    const products = productsRes.data || [];

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const totalOrders = orders.length;

    const fallbackInsight = {
        recommendations: [
          { title: "Review Inventory", description: "Check stock levels for your top-selling products.", icon: "Package" },
          { title: "Launch Promotion", description: "Consider creating a small discount offer to boost conversions.", icon: "Tag" },
          { title: "Optimize Listings", description: "Update product descriptions to improve SEO and visibility.", icon: "Sparkles" }
        ],
        summary: "Your store is gathering data; review basic metrics to improve performance."
    };

    const openAiKey = process.env.OPENAI_API_KEY;

    if (!openAiKey) {
       // Return fallback immediately if no API key is set
       return NextResponse.json({ data: fallbackInsight });
    }

    // Call OpenAI API
    const prompt = `
You are an expert e-commerce business analyst. Analyze the following data for an online store over the last 30 days and provide 3 highly actionable, specific recommendations to improve sales, stock management, or customer experience.
Output MUST be valid JSON in the exact structure below, without any markdown formatting or extra text.

Data summary:
- Total Revenue (last 30 days): ₹${totalRevenue}
- Total Orders (last 30 days): ${totalOrders}
- Products Catalog:
${products.slice(0, 10).map(p => `- ${p.name} (Stock: ${p.stock}, Price: ₹${p.price})`).join('\n')}

Required JSON format:
{
  "recommendations": [
    {
      "title": "Short title (e.g., 'Increase Stock')",
      "description": "Specific action to take.",
      "icon": "One of: 'TrendingUp', 'Package', 'Tag', 'AlertTriangle', 'Zap'"
    }
  ],
  "summary": "One-sentence summary."
}
`;

    let parsedInsight = fallbackInsight;

    try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
          })
        });

        if (openaiRes.ok) {
            const aiData = await openaiRes.json();
            const rawContent = aiData.choices[0].message.content;
            const jsonStr = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedInsight = JSON.parse(jsonStr);
        } else {
            console.error("OpenAI API returned non-ok status:", await openaiRes.text());
        }
    } catch (e) {
        console.error("Failed to parse or fetch OpenAI response:", e);
    }

    // Attempt to save, don't break if table is missing
    try {
        await supabase
          .from('ai_insights')
          .insert({
            website_id: websiteId,
            month: currentMonth,
            year: currentYear,
            insights: parsedInsight
          });
    } catch(e) {
        console.warn("Could not save insight (maybe table missing):", e);
    }

    return NextResponse.json({ data: parsedInsight });

  } catch (error) {
    console.error('AI Prediction API Error:', error);
    // Even on total failure, don't crash the frontend card
    return NextResponse.json({ data: {
        recommendations: [{ title: "System Notice", description: "AI analysis is temporarily unavailable.", icon: "AlertTriangle" }],
        summary: "Analysis unavailable."
    } });
  }
}

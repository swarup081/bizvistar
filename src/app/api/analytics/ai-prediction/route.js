import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
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

    // Verify ownership
    const { data: website } = await supabase.from('websites').select('id').eq('id', websiteId).eq('user_id', user.id).single();
    if (!website) return NextResponse.json({ error: "Website not found or access denied" }, { status: 403 });

    // Admin client to bypass RLS on monthly_predictions
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );


    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Check if an insight already exists for this month. We handle errors gracefully just in case the table doesn't exist
    
    
    
    let existingInsight = null;
    try {
      const monthString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
      
      const { data: prediction, error: insightError } = await supabaseAdmin.from('monthly_predictions')
        .select('prediction_data')
        .eq('website_id', websiteId)
        .eq('month', monthString)
        .maybeSingle();
      
      if (prediction && prediction.prediction_data) {
          existingInsight = { insights: prediction.prediction_data };
      }
    } catch (e) {
      console.warn("Could not check existing insights:", e);
    }



    if (existingInsight && existingInsight.insights && Object.keys(existingInsight.insights).length > 0) {
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
          { 
            title: "Review Inventory", 
            description: "Check stock levels for your top-selling products to avoid stockouts during peak hours.", 
            detailed_insight: "Based on recent sales velocity, maintaining at least a 20% buffer on top-selling items can prevent revenue loss from out-of-stock scenarios. Consider setting up automated low-stock alerts.",
            icon: "Package" 
          },
          { 
            title: "Launch Promotion", 
            description: "Consider creating a small discount offer to boost conversions.", 
            detailed_insight: "A targeted 10% discount on slow-moving inventory can help clear shelf space and improve cash flow while rewarding your existing customer base.",
            icon: "Tag" 
          },
          { 
            title: "Optimize Listings", 
            description: "Update product descriptions to improve SEO and visibility.", 
            detailed_insight: "Adding high-quality images and specific keywords to your product titles can increase organic search traffic by up to 15%. Focus on top categories first.",
            icon: "Sparkles" 
          }
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
You are an expert e-commerce business analyst. Analyze the following data for an online store over the last 30 days and provide 3 highly actionable, specific, numerical recommendations to improve sales, stock management, or customer experience.
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
      "title": "Short title (e.g., 'Increase Hug Candle Stock by 20')",
      "description": "A brief 1-sentence summary of the action.",
      "detailed_insight": "A longer, 2-3 sentence detailed explanation of *why* this action is recommended and *how* to execute it based on the data provided.",
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
            response_format: { type: "json_object" },
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
          })
        });

        if (openaiRes.ok) {
            const aiData = await openaiRes.json();
            let rawContent = aiData.choices[0].message.content;
            
            let jsonStr = rawContent.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
            let aiResult;
            try {
                aiResult = JSON.parse(jsonStr);
                parsedInsight = {
                   summary: aiResult.summary || fallbackInsight.summary,
                   recommendations: (aiResult.recommendations || []).map((rec, i) => ({
                       title: rec.title || fallbackInsight.recommendations[i]?.title || "Review Metric",
                       description: rec.description || fallbackInsight.recommendations[i]?.description || "Check your store stats.",
                       detailed_insight: rec.detailed_insight || fallbackInsight.recommendations[i]?.detailed_insight || "Maintain good inventory buffers.",
                       icon: rec.icon || fallbackInsight.recommendations[i]?.icon || "Sparkles"
                   }))
                };
            } catch (parseError) {
                console.error("OpenAI JSON Parse Error:", parseError, rawContent);
                parsedInsight = fallbackInsight;
            }
        } else {
            console.error("OpenAI API returned non-ok status:", await openaiRes.text());
            parsedInsight = fallbackInsight;
        }
    } catch (e) {
        console.error("Failed to parse or fetch OpenAI response:", e);
        parsedInsight = fallbackInsight;
    }

    
    
    // Attempt to save to monthly_predictions
    try {
        const monthString = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
        
        // Check if exists
        const { data: existing } = await supabaseAdmin.from('monthly_predictions')
            .select('id')
            .eq('website_id', websiteId)
            .eq('month', monthString)
            .maybeSingle();
            
        if (existing) {
            await supabaseAdmin.from('monthly_predictions').update({ prediction_data: parsedInsight })
              .eq('id', existing.id);
        } else {
            await supabaseAdmin.from('monthly_predictions').insert({
                  website_id: websiteId,
                  month: monthString,
                  prediction_data: parsedInsight
              });
        }
    } catch(e) {
        console.warn("Could not save insight to monthly_predictions:", e);
    }



    return NextResponse.json({ data: parsedInsight });

  } catch (error) {
    console.error('AI Prediction API Error:', error);
    // Even on total failure, don't crash the frontend card
    return NextResponse.json({ data: {
        recommendations: [{ 
            title: "System Notice", 
            description: "AI analysis is temporarily unavailable.", 
            detailed_insight: "Our AI systems are currently running maintenance or encountered an error. Please check back later for your personalized business insights.",
            icon: "AlertTriangle" 
        }],
        summary: "Analysis unavailable."
    } });
  }
}

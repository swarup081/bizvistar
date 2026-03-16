'use server';

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Server-side initialization (requires service role key for full admin access if needed,
// but regular requests should probably use RLS and the user's cookies.
// However, since we're in server actions and might need to bypass RLS for some internal aggregation,
// let's use the service role key if available, otherwise fallback.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder',
});

// Helper to calculate the start of the current month
function getStartOfMonth(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export async function fetchMonthlyTarget(websiteId) {
    if (!websiteId) return null;

    const startOfMonth = getStartOfMonth().toISOString();

    try {
        const { data, error } = await supabaseAdmin
            .from('monthly_targets')
            .select('target_revenue')
            .eq('website_id', websiteId)
            .eq('month', startOfMonth.split('T')[0])
            .maybeSingle();

        if (error) {
             console.error('Error fetching monthly target:', error);
             return null;
        }

        return data?.target_revenue || 0;
    } catch (e) {
        console.error('Exception fetching monthly target:', e);
        return null;
    }
}

export async function updateMonthlyTarget(websiteId, targetRevenue) {
    if (!websiteId) return { success: false, error: 'Missing website ID' };

    const startOfMonth = getStartOfMonth().toISOString().split('T')[0];

    try {
        const { error } = await supabaseAdmin
            .from('monthly_targets')
            .upsert(
                { website_id: websiteId, month: startOfMonth, target_revenue: targetRevenue },
                { onConflict: 'website_id, month' }
            );

        if (error) {
             console.error('Error updating monthly target:', error);
             return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e) {
        console.error('Exception updating monthly target:', e);
        return { success: false, error: e.message };
    }
}

export async function getOrGenerateMonthlyPrediction(websiteId) {
    if (!websiteId) return null;

    const startOfMonthStr = getStartOfMonth().toISOString().split('T')[0];

    try {
        // 1. Check if prediction exists for this month
        const { data: existingPrediction, error: fetchError } = await supabaseAdmin
            .from('monthly_predictions')
            .select('prediction_data')
            .eq('website_id', websiteId)
            .eq('month', startOfMonthStr)
            .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') {
             console.error('Error fetching prediction:', fetchError);
        }

        if (existingPrediction?.prediction_data && Object.keys(existingPrediction.prediction_data).length > 0) {
            return existingPrediction.prediction_data;
        }

        // 2. If not, we need to generate it. First, fetch last 2 months of data.
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const [ordersRes, analyticsRes] = await Promise.all([
            supabaseAdmin.from('orders')
                .select('total_amount, created_at, status, order_items(quantity, price, products(name, category_id))')
                .eq('website_id', websiteId)
                .gte('created_at', twoMonthsAgo.toISOString()),
            supabaseAdmin.from('client_analytics')
                .select('event_type, path, timestamp, location')
                .eq('website_id', websiteId)
                .gte('timestamp', twoMonthsAgo.toISOString())
        ]);

        const orders = ordersRes.data || [];
        const events = analyticsRes.data || [];

        // Prepare a summary for the AI
        const summary = {
            total_orders: orders.length,
            total_revenue: orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
            recent_events_count: events.length,
            // Could add more aggregations here, but sending raw data (truncated) might be better
        };

        const prompt = `
            You are an expert e-commerce business analyst AI.
            Analyze the following e-commerce data from the last 2 months and provide actionable insights.

            Return the output strictly as a JSON object with the following structure:
            {
                "summary": "A short, 1-2 sentence summary of overall performance.",
                "actionableInsights": [
                    {
                        "type": "stock" | "offer" | "marketing" | "general",
                        "title": "Short title of the suggestion",
                        "description": "Detailed explanation of what to do",
                        "impactLevel": "High" | "Medium" | "Low"
                    }
                ],
                "predictedRevenueNextMonth": "Numeric estimate based on current trend (e.g. 5000)",
                "thermalMapData": [
                    { "productName": "Name", "heatScore": 1-100 }
                ]
            }

            Data Summary:
            ${JSON.stringify(summary)}

            (Note: if data is sparse, provide generic but helpful e-commerce best practices as insights based on low traffic/sales).
        `;

        if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'placeholder') {
             const completion = await openai.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-4o-mini", // Requested by user
                response_format: { type: "json_object" },
            });

            const aiResponseText = completion.choices[0].message.content;
            const predictionData = JSON.parse(aiResponseText);

            // 3. Save it to DB
            await supabaseAdmin.from('monthly_predictions').upsert(
                 { website_id: websiteId, month: startOfMonthStr, prediction_data: predictionData },
                 { onConflict: 'website_id, month' }
            );

            return predictionData;
        } else {
             // Mock prediction for development if no key
             const mockPrediction = {
                "summary": "Sales have been steady but show room for improvement in conversion.",
                "actionableInsights": [
                    {
                        "type": "stock",
                        "title": "Increase stock for top performers",
                        "description": "Your top 3 products are selling fast. Consider increasing inventory by 20%.",
                        "impactLevel": "High"
                    },
                    {
                        "type": "offer",
                        "title": "Bundle complementary items",
                        "description": "Create a bundle offer for items frequently bought together to increase AOV.",
                        "impactLevel": "Medium"
                    }
                ],
                "predictedRevenueNextMonth": summary.total_revenue > 0 ? summary.total_revenue * 1.1 : 5000,
                "thermalMapData": [
                    { "productName": "Premium Widget", "heatScore": 85 },
                    { "productName": "Basic Gadget", "heatScore": 45 },
                    { "productName": "Accessory Pack", "heatScore": 92 }
                ]
             };
             return mockPrediction;
        }

    } catch (e) {
        console.error('Exception generating prediction:', e);
        return null;
    }
}

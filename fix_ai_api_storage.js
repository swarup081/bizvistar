const fs = require('fs');
const file = 'src/app/api/analytics/ai-prediction/route.js';
let content = fs.readFileSync(file, 'utf8');

// The AI route should store its data in website_data.analytics.ai_insights
const checkExisting = `
    let existingInsight = null;
    try {
      const { data: website, error: insightError } = await supabase
        .from('websites')
        .select('website_data')
        .eq('id', websiteId)
        .single();

      const websiteData = website?.website_data || {};
      const key = \`\${currentYear}-\${currentMonth}\`;

      if (websiteData.analytics?.ai_insights && websiteData.analytics.ai_insights[key]) {
          existingInsight = { insights: websiteData.analytics.ai_insights[key] };
      }
    } catch (e) {
      console.warn("Could not check existing insights:", e);
    }
`;
content = content.replace(/let existingInsight = null;[\s\S]*?catch \(e\) \{\s*console\.warn\("Table ai_insights might not exist yet:", e\);\s*\}/, checkExisting);

const saveNew = `
    // Attempt to save to website_data
    try {
        const { data: website } = await supabase
          .from('websites')
          .select('website_data')
          .eq('id', websiteId)
          .single();

        let websiteData = website?.website_data || {};
        if (!websiteData.analytics) websiteData.analytics = {};
        if (!websiteData.analytics.ai_insights) websiteData.analytics.ai_insights = {};

        const key = \`\${currentYear}-\${currentMonth}\`;
        websiteData.analytics.ai_insights[key] = parsedInsight;

        await supabase
          .from('websites')
          .update({ website_data: websiteData })
          .eq('id', websiteId);

    } catch(e) {
        console.warn("Could not save insight:", e);
    }
`;
content = content.replace(/\/\/ Attempt to save, don't break if table is missing[\s\S]*?catch\(e\) \{\s*console\.warn\("Could not save insight \(maybe table missing\):", e\);\s*\}/, saveNew);

fs.writeFileSync(file, content);
console.log('Fixed AI API Storage');

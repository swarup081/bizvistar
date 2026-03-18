const fs = require('fs');
const file = 'src/app/api/analytics/ai-prediction/route.js';
let content = fs.readFileSync(file, 'utf8');

// The issue might be that the DB `ai_insights` table doesn't exist, and `maybeSingle()` throws an error or fails.
// Also, when `websiteId` is missing, it returns a 400, but if OpenAI API key is missing, it skips saving.

content = content.replace(/let existingInsight = null;[\s\S]*?if \(existingInsight && existingInsight\.insights\)/, `
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

    if (existingInsight && existingInsight.insights && Object.keys(existingInsight.insights).length > 0)`);

// ensure fallback is ALWAYS returned if OpenAI fails, so it never returns an empty response.
content = content.replace(/} else \{\s*console\.error\("OpenAI API returned non-ok status:", await openaiRes\.text\(\)\);\s*\}/, `} else {
            console.error("OpenAI API returned non-ok status:", await openaiRes.text());
            parsedInsight = fallbackInsight;
        }`);

// Fix error catch
content = content.replace(/catch \(e\) \{\s*console\.error\("Failed to parse or fetch OpenAI response:", e\);\s*\}/, `catch (e) {
        console.error("Failed to parse or fetch OpenAI response:", e);
        parsedInsight = fallbackInsight;
    }`);

fs.writeFileSync(file, content);
console.log('Fixed AI API route');

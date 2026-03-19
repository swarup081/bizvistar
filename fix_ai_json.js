const fs = require('fs');
const file = 'src/app/api/analytics/ai-prediction/route.js';
let content = fs.readFileSync(file, 'utf8');

// Add response_format to OpenAI request to strictly enforce JSON output
content = content.replace(/model: "gpt-3\.5-turbo",\s*messages:/, 'model: "gpt-3.5-turbo",\n            response_format: { type: "json_object" },\n            messages:');

// Let's also wrap the JSON.parse in a try/catch specifically so that if the AI hallucinates, it catches cleanly and uses the fallback.
content = content.replace(/let jsonStr = rawContent\.replace\(\/```json\/g, ''\)\.replace\(\/```\/g, ''\)\.trim\(\);\s*let aiResult = JSON\.parse\(jsonStr\);[\s\S]*?icon: rec\.icon \|\| fallbackInsight\.recommendations\[i\]\.icon\s*\}\)\)\s*\};/, `
            let jsonStr = rawContent.replace(/\\\`\\\`\\\`json/g, '').replace(/\\\`\\\`\\\`/g, '').trim();
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
            }`);

fs.writeFileSync(file, content);
console.log('Fixed OpenAI JSON enforcement');

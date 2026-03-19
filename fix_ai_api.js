const fs = require('fs');
const file = 'src/app/api/analytics/ai-prediction/route.js';
let content = fs.readFileSync(file, 'utf8');

// Replace website_data storage with public.monthly_predictions table

const existingCheckBlock = `
    let existingInsight = null;
    try {
      const monthString = \`\${currentYear}-\${String(currentMonth).padStart(2, '0')}-01\`;

      const { data: prediction, error: insightError } = await supabase
        .from('monthly_predictions')
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
`;
content = content.replace(/let existingInsight = null;[\s\S]*?catch \(e\) \{\s*console\.warn\("Could not check existing insights:", e\);\s*\}/, existingCheckBlock);

const newSaveBlock = `
    // Attempt to save to monthly_predictions
    try {
        const monthString = \`\${currentYear}-\${String(currentMonth).padStart(2, '0')}-01\`;

        // Check if exists
        const { data: existing } = await supabase
            .from('monthly_predictions')
            .select('id')
            .eq('website_id', websiteId)
            .eq('month', monthString)
            .maybeSingle();

        if (existing) {
            await supabase
              .from('monthly_predictions')
              .update({ prediction_data: parsedInsight })
              .eq('id', existing.id);
        } else {
            await supabase
              .from('monthly_predictions')
              .insert({
                  website_id: websiteId,
                  month: monthString,
                  prediction_data: parsedInsight
              });
        }
    } catch(e) {
        console.warn("Could not save insight to monthly_predictions:", e);
    }
`;
content = content.replace(/\/\/ Attempt to save to website_data[\s\S]*?catch\(e\) \{\s*console\.warn\("Could not save insight:", e\);\s*\}/, newSaveBlock);

fs.writeFileSync(file, content);
console.log('Fixed AI API route to use monthly_predictions table');

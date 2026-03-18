const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/analytics/MonthlyTargetCard.js', 'utf8');

// Fix the manual upsert logic that had missing variable declarations
content = content.replace(`
          let error;
          if (existing) {
              const res = await supabase.from('monthly_targets')
                  .update({ target_amount: newTarget })
                  .eq('id', existing.id);
              error = res.error;
          } else {
              const res = await supabase.from('monthly_targets')
                  .insert({ website_id: websiteId, month: currentMonth, year: currentYear, target_amount: newTarget });
              error = res.error;
          }

          if (!error) {
`, `
          let queryError = null;
          if (existing) {
              const { error: e1 } = await supabase.from('monthly_targets')
                  .update({ target_amount: newTarget })
                  .eq('id', existing.id);
              queryError = e1;
          } else {
              const { error: e2 } = await supabase.from('monthly_targets')
                  .insert({ website_id: websiteId, month: currentMonth, year: currentYear, target_amount: newTarget });
              queryError = e2;
          }

          if (!queryError) {
`);

content = content.replace(`console.error("Error saving target:", error);`, `console.error("Error saving target:", queryError);`);

fs.writeFileSync('src/components/dashboard/analytics/MonthlyTargetCard.js', content);

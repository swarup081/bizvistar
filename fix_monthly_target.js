const fs = require('fs');
const path = 'src/components/dashboard/analytics/MonthlyTargetCard.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/export default function MonthlyTargetCard\(\{ websiteId, currentRevenue, prevRevenue = 0 \}\) \{/, 'export default function MonthlyTargetCard({ websiteId, currentRevenue, prevRevenue = 0, targetMultiplier = 1 }) {');

content = content.replace(/import \{ saveMonthlyTarget, getMonthlyTarget \} from '@\/app\/actions\/analyticsActions';/, "import { saveMonthlyTarget, getMonthlyTarget } from '@/app/actions/analyticsActions';\nimport { supabase } from '@/lib/supabaseClient';");

// Use direct DB update bypassing server actions
const newHandleSave = `
  const handleSave = async (e) => {
      e.preventDefault();
      e.stopPropagation(); // Stop event bubbling
      const newTarget = parseInt(editValue, 10);
      if (isNaN(newTarget) || newTarget <= 0) {
          setIsEditing(false);
          return;
      }
      setLoading(true);

      try {
          const { data: website } = await supabase.from('websites').select('website_data').eq('id', websiteId).single();
          let websiteData = website?.website_data || {};
          if (!websiteData.analytics) websiteData.analytics = {};
          if (!websiteData.analytics.monthly_targets) websiteData.analytics.monthly_targets = {};

          const key = \`\${currentYear}-\${currentMonth}\`;
          websiteData.analytics.monthly_targets[key] = newTarget;

          const { error } = await supabase.from('websites').update({ website_data: websiteData }).eq('id', websiteId);

          if (!error) {
             setTarget(newTarget);
             setIsEditing(false);
          } else {
             console.error("Error saving target:", error.message);
          }
      } catch (err) {
          console.error("Error saving target:", err);
      }
      setLoading(false);
  };
`;
content = content.replace(/const handleSave = async \(e\) => \{[\s\S]*?setLoading\(false\);\s*\};/, newHandleSave);

const newHandleReset = `
  const handleReset = async () => {
      setLoading(true);
      try {
          const { data: website } = await supabase.from('websites').select('website_data').eq('id', websiteId).single();
          let websiteData = website?.website_data || {};
          if (!websiteData.analytics) websiteData.analytics = {};
          if (!websiteData.analytics.monthly_targets) websiteData.analytics.monthly_targets = {};

          const key = \`\${currentYear}-\${currentMonth}\`;
          websiteData.analytics.monthly_targets[key] = 600000;

          const { error } = await supabase.from('websites').update({ website_data: websiteData }).eq('id', websiteId);

          if (!error) {
              setTarget(600000); // Reset to default visual
              setIsDropdownOpen(false);
          }
      } catch (err) {
          console.error("Error resetting target", err);
      }
      setLoading(false);
  };
`;
content = content.replace(/const handleReset = async \(\) => \{[\s\S]*?setLoading\(false\);\s*\};/, newHandleReset);


const mathUpdate = `
  const scaledTarget = target * targetMultiplier;
  const percentage = Math.min(100, (currentRevenue / scaledTarget) * 100);
`;
content = content.replace(/const percentage = Math\.min\(100, \(currentRevenue \/ target\) \* 100\);/, mathUpdate);

// Move the text down slightly
const textBlock = `
      <div className="text-center mt-auto mb-6">
          <p className="text-sm font-bold text-gray-800">Great Progress! 🎉</p>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed px-2">
              Our achievement <span className="text-[#8A63D2] font-semibold">{growthText}</span>;
              let's reach 100% next month.
          </p>
      </div>
`;
content = content.replace(/<div className="text-center mt-6 mb-4">[\s\S]*?<\/div>/, textBlock);

content = content.replace(/<span className="text-sm font-bold text-gray-900">₹\{target\.toLocaleString\(\)\}<\/span>/g, '<span className="text-sm font-bold text-gray-900">₹{scaledTarget.toLocaleString()}</span>');


fs.writeFileSync(path, content);
console.log('Fixed MonthlyTargetCard');

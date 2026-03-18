const fs = require('fs');
const file = 'src/components/dashboard/analytics/MonthlyTargetCard.js';
let content = fs.readFileSync(file, 'utf8');

// replace supabase imports with actions
content = content.replace(/import { supabase } from '@\/lib\/supabaseClient';/g, "import { saveMonthlyTarget, getMonthlyTarget } from '@/app/actions/analyticsActions';");

// replace useEffect fetchTarget
const newEffect = `
  useEffect(() => {
     async function fetchTarget() {
         if (!websiteId) return;
         try {
             const res = await getMonthlyTarget(websiteId);
             if (res && res.data) {
                 setTarget(res.data);
             }
         } catch (e) {
             console.error("Failed to load target", e);
         }
     }
     fetchTarget();
  }, [websiteId]);
`;
content = content.replace(/useEffect\(\(\) => \{\s*async function fetchTarget\(\) \{[\s\S]*?fetchTarget\(\);\s*\}, \[websiteId, currentMonth, currentYear\]\);/, newEffect);

// replace handleSave
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
          const res = await saveMonthlyTarget(websiteId, newTarget);
          if (res && res.success) {
             setTarget(newTarget);
             setIsEditing(false);
          } else {
             console.error("Error saving target:", res.error);
          }
      } catch (err) {
          console.error("Error saving target:", err);
      }
      setLoading(false);
  };
`;
content = content.replace(/const handleSave = async \(e\) => \{[\s\S]*?setLoading\(false\);\s*\};/, newHandleSave);

// replace handleReset
const newHandleReset = `
  const handleReset = async () => {
      setLoading(true);
      try {
          const res = await saveMonthlyTarget(websiteId, 600000); // 6L is default placeholder visually
          if (res && res.success) {
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

fs.writeFileSync(file, content);
console.log('Fixed MonthlyTargetCard to use server actions.');

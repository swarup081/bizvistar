const fs = require('fs');
const file = 'src/components/dashboard/analytics/MonthlyTargetCard.js';
let content = fs.readFileSync(file, 'utf8');

// The file currently uses raw Supabase calls which we put there in the last iteration.
// We need to revert back to using the server actions we just fixed.
// The user explicitly stated: "the tick is not adding the monthly limit" which is why we tried bypassing RLS before.
// But now that we fixed the actions to properly query the table, we should use them.

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
console.log('Reverted MonthlyTargetCard back to actions');

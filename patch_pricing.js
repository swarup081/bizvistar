const fs = require('fs');
const file = 'src/app/pricing/page.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports at the top
content = content.replace(
  `import { motion, AnimatePresence } from 'framer-motion';`,
  `import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';`
);

// 2. Add state and fetch logic inside PricingPage component
content = content.replace(
  `export default function PricingPage() {`,
  `export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const searchParams = useSearchParams();
  const isUpdateFlow = searchParams.get('update') === 'true';

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: subs } = await supabase
          .from('subscriptions')
          .select('*, plans(name)')
          .eq('user_id', user.id)
          .in('status', ['active', 'trialing'])
          .order('id', { ascending: false })
          .limit(1);

      if (subs && subs.length > 0 && subs[0].plans) {
          let cycle = 'monthly';
          if (subs[0].plans.name.toLowerCase().includes('yearly')) cycle = 'yearly';
          setCurrentPlan({
             name: subs[0].plans.name.replace(/ yearly| monthly/gi, ''),
             cycle: cycle
          });
          // Auto-toggle to the user's current billing cycle
          setIsYearly(cycle === 'yearly');
      } else {
          setCurrentPlan({ name: 'Starter', cycle: 'monthly' }); // Default active
      }
    };
    fetchCurrentPlan();
  }, []);`
);

// 3. Update the CTA rendering to disable the button if it's the active plan
// Look for the <button> inside <Link> rendering loop or map
// There are multiple places. I will write a regex replacement to find the plan map:

content = content.replace(
  /<Link href={{[^}]+pathname: '\/checkout'[^}]+plan: plan.name[^}]+}} className="w-full">[\s\S]*?<\/button>/g,
  (match) => {
    return `{currentPlan?.name === plan.name && currentPlan?.cycle === (isYearly ? 'yearly' : 'monthly') ? (
        <button disabled className="w-full py-4 rounded-full text-xl font-bold transition-all duration-200 bg-gray-200 text-gray-500 cursor-not-allowed">
            Current Plan
        </button>
    ) : (
        ${match}
    )}`;
  }
);


fs.writeFileSync(file, content);

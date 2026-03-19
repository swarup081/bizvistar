const fs = require('fs');
const file = 'src/app/api/analytics/ai-prediction/route.js';
let content = fs.readFileSync(file, 'utf8');

const importAdmin = "import { createServerClient } from '@supabase/ssr';\nimport { createClient } from '@supabase/supabase-js';\nimport { cookies } from 'next/headers';";

content = content.replace(/import \{ createServerClient \} from '@supabase\/ssr';\nimport \{ cookies \} from 'next\/headers';/, importAdmin);

const adminSetup = `
    const { websiteId } = await req.json();

    if (!websiteId) {
      return NextResponse.json({ error: 'Missing websiteId' }, { status: 400 });
    }

    // Verify ownership
    const { data: website } = await supabase.from('websites').select('id').eq('id', websiteId).eq('user_id', user.id).single();
    if (!website) return NextResponse.json({ error: "Website not found or access denied" }, { status: 403 });

    // Admin client to bypass RLS on monthly_predictions
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
`;

content = content.replace(/const \{ websiteId \} = await req\.json\(\);\s*if \(!websiteId\) \{\s*return NextResponse\.json\(\{ error: 'Missing websiteId' \}, \{ status: 400 \}\);\s*\}/, adminSetup);

// Replace supabase.from('monthly_predictions') with supabaseAdmin.from('monthly_predictions')
content = content.replace(/const \{ data: prediction, error: insightError \} = await supabase\s*\.from\('monthly_predictions'\)/, "const { data: prediction, error: insightError } = await supabaseAdmin.from('monthly_predictions')");

content = content.replace(/const \{ data: existing \} = await supabase\s*\.from\('monthly_predictions'\)/, "const { data: existing } = await supabaseAdmin.from('monthly_predictions')");

content = content.replace(/await supabase\s*\.from\('monthly_predictions'\)\s*\.update/, "await supabaseAdmin.from('monthly_predictions').update");

content = content.replace(/await supabase\s*\.from\('monthly_predictions'\)\s*\.insert/, "await supabaseAdmin.from('monthly_predictions').insert");

fs.writeFileSync(file, content);
console.log('Fixed AI API to use supabaseAdmin');

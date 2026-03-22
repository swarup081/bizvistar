import re

with open('src/app/actions/boostActions.js', 'r') as f:
    content = f.read()

# Move revalidatePath to the top
content = content.replace("import { revalidatePath } from 'next/cache';\n\nexport async function getOffers(websiteId) {", "export async function getOffers(websiteId) {")
content = content.replace("import { createServerClient } from '@supabase/ssr';", "import { createServerClient } from '@supabase/ssr';\nimport { revalidatePath } from 'next/cache';")

with open('src/app/actions/boostActions.js', 'w') as f:
    f.write(content)
print("Moved revalidatePath import to top")

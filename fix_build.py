import os

with open('src/lib/supabaseClient.js', 'r') as f:
    content = f.read()

# Make sure placeholder is used
content = content.replace('const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;',
                          "const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';")
content = content.replace('const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;',
                          "const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';")

with open('src/lib/supabaseClient.js', 'w') as f:
    f.write(content)

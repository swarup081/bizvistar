import re

with open('src/app/actions/boostActions.js', 'r') as f:
    content = f.read()

# Remove the entire block of createClient since it's unused and breaking the import order
content = re.sub(
    r"const createClient = async \(\) => \{[\s\S]*?\};\nimport \{ revalidatePath \} from 'next/cache';",
    "import { revalidatePath } from 'next/cache';",
    content
)

with open('src/app/actions/boostActions.js', 'w') as f:
    f.write(content)
print("Cleaned up boostActions.js imports and dead code")

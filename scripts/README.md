# Database Population Scripts

These scripts are used to populate the database with required plan data and sync existing subscriptions from Razorpay.

## Prerequisites

1.  Ensure you have Node.js installed.
2.  Install dependencies:
    ```bash
    npm install
    ```
    (Note: `package.json` includes `@supabase/supabase-js`, `razorpay`, and `dotenv`)

3.  Set your environment variables.
    *   If you have a `.env` file, the scripts will load it automatically.
    *   If you have a `.env.local` file (common in Next.js), see the execution commands below.

    Required variables:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `SUPABASE_SERVICE_ROLE_KEY`
    *   `NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID` (or `RAZORPAY_TEST_KEY_ID`)
    *   `RAZORPAY_TEST_KEY_SECRET`
    *   `NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID` (or `RAZORPAY_Live_Key_ID`)
    *   `RAZORPAY_LIVE_KEY_SECRET`

## 1. Schema Migration

Before running the seed script, you must add the `product_limit` column to the `public.plans` table. Run the following SQL in your Supabase SQL Editor:

```sql
-- scripts/add_product_limit.sql

ALTER TABLE public.plans
ADD COLUMN IF NOT EXISTS product_limit integer DEFAULT -1;

COMMENT ON COLUMN public.plans.product_limit IS 'Limit on number of products a user can create. -1 indicates unlimited.';
```

## 2. Seed Plans

This script populates the `public.plans` table with all Live and Test plans, including the new `product_limit` field.

**If using `.env`:**
```bash
node scripts/seed_plans.js
```

**If using `.env.local`:**
```bash
node -r dotenv/config scripts/seed_plans.js dotenv_config_path=.env.local
```

## 3. Sync Subscriptions

This script fetches all subscriptions from Razorpay (both Test and Live modes) and upserts them into the `public.subscriptions` table.

**If using `.env`:**
```bash
node scripts/sync_subs.js
```

**If using `.env.local`:**
```bash
node -r dotenv/config scripts/sync_subs.js dotenv_config_path=.env.local
```

## Troubleshooting

*   If `seed_plans.js` fails with "column product_limit does not exist", ensure you ran the SQL migration in Step 1.
*   If `seed_plans.js` fails, ensure your Supabase URL and Service Role Key are correct.
*   If `sync_subs.js` skips subscriptions with "Plan ID not found", ensure you have run `seed_plans.js` first.

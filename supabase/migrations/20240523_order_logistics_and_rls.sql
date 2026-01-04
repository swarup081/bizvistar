-- 1. Ensure RLS is enabled on existing tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Add shipping_address to orders (Snapshot of address at purchase time)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS shipping_address jsonb;

-- 3. Create Deliveries Table
CREATE TABLE IF NOT EXISTS public.deliveries (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  provider text,
  tracking_number text,
  tracking_url text,
  status text DEFAULT 'shipped',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- 4. Create/Update Policies for Dashboard Access (Read/Write)

-- Helper: Users can see data related to their websites
-- Note: These policies assume a 'websites' table linking 'user_id' exists.

-- Orders Policies
DROP POLICY IF EXISTS "Dashboard users can view their orders" ON public.orders;
CREATE POLICY "Dashboard users can view their orders" ON public.orders
FOR SELECT USING (
  website_id IN (SELECT id FROM public.websites WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Dashboard users can update their orders" ON public.orders;
CREATE POLICY "Dashboard users can update their orders" ON public.orders
FOR UPDATE USING (
  website_id IN (SELECT id FROM public.websites WHERE user_id = auth.uid())
);

-- Customers Policies
DROP POLICY IF EXISTS "Dashboard users can view their customers" ON public.customers;
CREATE POLICY "Dashboard users can view their customers" ON public.customers
FOR SELECT USING (
  website_id IN (SELECT id FROM public.websites WHERE user_id = auth.uid())
);

-- Order Items Policies (linked via order)
DROP POLICY IF EXISTS "Dashboard users can view their order items" ON public.order_items;
CREATE POLICY "Dashboard users can view their order items" ON public.order_items
FOR SELECT USING (
  order_id IN (
    SELECT id FROM public.orders WHERE website_id IN (
      SELECT id FROM public.websites WHERE user_id = auth.uid()
    )
  )
);

-- Products Policies
DROP POLICY IF EXISTS "Dashboard users can view their products" ON public.products;
CREATE POLICY "Dashboard users can view their products" ON public.products
FOR SELECT USING (
  website_id IN (SELECT id FROM public.websites WHERE user_id = auth.uid())
);

-- Deliveries Policies
DROP POLICY IF EXISTS "Dashboard users can view deliveries" ON public.deliveries;
CREATE POLICY "Dashboard users can view deliveries" ON public.deliveries
FOR SELECT USING (
  order_id IN (
    SELECT id FROM public.orders WHERE website_id IN (
      SELECT id FROM public.websites WHERE user_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "Dashboard users can manage deliveries" ON public.deliveries;
CREATE POLICY "Dashboard users can manage deliveries" ON public.deliveries
FOR ALL USING (
  order_id IN (
    SELECT id FROM public.orders WHERE website_id IN (
      SELECT id FROM public.websites WHERE user_id = auth.uid()
    )
  )
);

-- 5. Public Access Policies (For Checkout/Storefront)
-- Assuming 'websites.is_published' handles visibility, but for data fetching via API:

DROP POLICY IF EXISTS "Public can view products of published sites" ON public.products;
CREATE POLICY "Public can view products of published sites" ON public.products
FOR SELECT USING (
  website_id IN (SELECT id FROM public.websites WHERE is_published = true)
);

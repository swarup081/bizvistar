-- Migration for Apps (Offers, Offer Claims)

CREATE TABLE IF NOT EXISTS public.offers (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  website_id bigint NOT NULL,
  code text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['percentage'::text, 'fixed'::text])),
  value numeric NOT NULL,
  min_order_value numeric DEFAULT 0,
  max_discount numeric,
  usage_limit integer,
  used_count integer DEFAULT 0,
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT offers_pkey PRIMARY KEY (id),
  CONSTRAINT offers_website_id_fkey FOREIGN KEY (website_id) REFERENCES public.websites(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.offer_claims (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  website_id bigint NOT NULL,
  offer_id bigint NOT NULL,
  phone_number text NOT NULL,
  claimed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT offer_claims_pkey PRIMARY KEY (id),
  CONSTRAINT offer_claims_website_id_fkey FOREIGN KEY (website_id) REFERENCES public.websites(id) ON DELETE CASCADE,
  CONSTRAINT offer_claims_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.offers(id) ON DELETE CASCADE
);

-- Note: The websites table's website_data JSONB column will be updated
-- at the application level to include:
-- {
--   "offersConfig": { "showOffers": boolean },
--   "delivery": { "type": "free_over_threshold" | "fixed", "cost": number, "threshold": number }
-- }

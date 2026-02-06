-- Run this SQL in your Supabase SQL Editor to support the new features

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS additional_images jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]'::jsonb;

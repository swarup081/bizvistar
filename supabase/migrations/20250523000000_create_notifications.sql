-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  website_id bigint NOT NULL,
  type text NOT NULL, -- 'new_order', 'low_stock', 'out_of_stock'
  title text NOT NULL,
  message text,
  data jsonb DEFAULT '{}'::jsonb, -- Store order_id, product_id, etc.
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_website_id_fkey FOREIGN KEY (website_id) REFERENCES public.websites(id) ON DELETE CASCADE
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_website_id ON public.notifications(website_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own website notifications
CREATE POLICY "Users can view notifications for their websites" ON public.notifications
  FOR SELECT
  USING (
    website_id IN (
      SELECT id FROM public.websites WHERE user_id = auth.uid()
    )
  );

-- Create policy to allow users to update their own website notifications (mark as read)
CREATE POLICY "Users can update notifications for their websites" ON public.notifications
  FOR UPDATE
  USING (
    website_id IN (
      SELECT id FROM public.websites WHERE user_id = auth.uid()
    )
  );

-- Create policy to allow users to delete their own website notifications
CREATE POLICY "Users can delete notifications for their websites" ON public.notifications
  FOR DELETE
  USING (
    website_id IN (
      SELECT id FROM public.websites WHERE user_id = auth.uid()
    )
  );

-- Allow service role (server actions) to insert notifications

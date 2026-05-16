-- Chat Sessions table — stores chat session metadata
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  website_id bigint NOT NULL,
  session_id text NOT NULL,
  message_count integer DEFAULT 0,
  topics text[] DEFAULT '{}',
  started_at timestamp with time zone DEFAULT now(),
  ended_at timestamp with time zone,
  metadata jsonb DEFAULT '{}',
  CONSTRAINT chat_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT chat_sessions_website_id_fkey FOREIGN KEY (website_id) REFERENCES public.websites(id) ON DELETE CASCADE
);

-- Chat Feedback table — per-message thumbs up/down
CREATE TABLE IF NOT EXISTS public.chat_feedback (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  website_id bigint NOT NULL,
  session_id text,
  message_index integer,
  message_content text,
  feedback text NOT NULL CHECK (feedback IN ('up', 'down')),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_feedback_pkey PRIMARY KEY (id),
  CONSTRAINT chat_feedback_website_id_fkey FOREIGN KEY (website_id) REFERENCES public.websites(id) ON DELETE CASCADE
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_chat_sessions_website_id ON public.chat_sessions(website_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_id ON public.chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_website_id ON public.chat_feedback(website_id);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_session_id ON public.chat_feedback(session_id);

-- RLS policies (allow service role full access)
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;

-- Service role bypass
CREATE POLICY "Service role can manage chat_sessions" ON public.chat_sessions
  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage chat_feedback" ON public.chat_feedback
  FOR ALL USING (true) WITH CHECK (true);

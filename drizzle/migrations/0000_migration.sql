-- 错题本：每位学习者的错题记录
CREATE TABLE public.mistakes (
  id text NOT NULL,
  user_id uuid NOT NULL,
  kind text NOT NULL,
  word text NOT NULL,
  meaning text NOT NULL DEFAULT '',
  your_answer text NOT NULL DEFAULT '',
  lesson_id text,
  count integer NOT NULL DEFAULT 1,
  last_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mistakes TO authenticated;
GRANT ALL ON public.mistakes TO service_role;
ALTER TABLE public.mistakes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own mistakes" ON public.mistakes
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 测验成绩记录
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id text,
  total integer NOT NULL,
  correct integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own attempts" ON public.quiz_attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own attempts" ON public.quiz_attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- AI 情景批改记录
CREATE TABLE public.coach_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id text,
  prompt text NOT NULL,
  answer text NOT NULL,
  feedback text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.coach_results TO authenticated;
GRANT ALL ON public.coach_results TO service_role;
ALTER TABLE public.coach_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own coach results" ON public.coach_results
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own coach results" ON public.coach_results
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
ALTER TABLE public.mistakes
  ADD COLUMN review_stage integer NOT NULL DEFAULT 0,
  ADD COLUMN next_review_at timestamptz,
  ADD COLUMN mastered_at timestamptz,
  ADD COLUMN review_updated_at timestamptz NOT NULL DEFAULT now();
UPDATE public.mistakes SET next_review_at = last_at + interval '1 day', review_updated_at = last_at;
ALTER TABLE public.mistakes ADD CONSTRAINT mistakes_review_stage_range CHECK (review_stage BETWEEN 0 AND 2);
CREATE INDEX mistakes_due_review_idx ON public.mistakes (user_id, next_review_at) WHERE mastered_at IS NULL;
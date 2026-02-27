-- ============================================================
-- AI News Aggregator — Complete Database Schema
-- Run this in the Supabase SQL Editor
-- © 2026 AK 0121 Agency
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. ARTICLES TABLE
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id                uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  title             text    NOT NULL UNIQUE,          -- UNIQUE enables DB-level dedup
  source_domain     text,
  source_url        text,                             -- used by db_service.py
  content_summary   text,
  category          text    DEFAULT 'general',        -- used by db_service.py
  sentiment         text,                             -- 'positive' | 'negative' | 'neutral'
  is_fake           boolean,
  credibility_score real,
  ai_reasoning      text,
  published_at      timestamp with time zone DEFAULT now(),
  created_at        timestamp with time zone DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 2. NAMED VISITORS TABLE  (name-based login / auth)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS named_visitors (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name       text UNIQUE NOT NULL,               -- visitor display name (unique)
  created_at timestamp with time zone DEFAULT now()
);
-- Step 1: Enable RLS on the existing table
ALTER TABLE named_visitors ENABLE ROW LEVEL SECURITY;

-- Step 2: Add the policies
CREATE POLICY "Allow public read"
  ON named_visitors FOR SELECT USING (true);

CREATE POLICY "Allow public insert"
  ON named_visitors FOR INSERT WITH CHECK (true);


-- ────────────────────────────────────────────────────────────
-- 3. USER PROFILES TABLE
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id           uuid    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name         text,                                 -- display name
  saved_topics text[],
  created_at   timestamp with time zone DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- 3. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────
ALTER TABLE articles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE named_visitors  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles   ENABLE ROW LEVEL SECURITY;

-- Articles: fully public (read + write for backend service)
CREATE POLICY "Articles: public read"
  ON articles FOR SELECT USING (true);

CREATE POLICY "Articles: public insert"
  ON articles FOR INSERT WITH CHECK (true);

CREATE POLICY "Articles: public update"
  ON articles FOR UPDATE USING (true);

-- Named Visitors: fully public (name-only login, no auth.users)
CREATE POLICY "Named visitors: public read"
  ON named_visitors FOR SELECT USING (true);

CREATE POLICY "Named visitors: public insert"
  ON named_visitors FOR INSERT WITH CHECK (true);

-- User Profiles: scoped to authenticated user
CREATE POLICY "Profiles: user can insert own row"
  ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: user can view own row"
  ON user_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles: user can update own row"
  ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- ────────────────────────────────────────────────────────────
-- 4. PERFORMANCE INDEXES
-- ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_articles_published_at  ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category      ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_credibility   ON articles (credibility_score DESC);

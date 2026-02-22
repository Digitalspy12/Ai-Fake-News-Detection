-- AI News Aggregator Database Schema
-- Run this in the Supabase SQL Editor

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  source_domain text,
  content_summary text,
  sentiment text, -- 'positive', 'negative', 'neutral'
  is_fake boolean,
  credibility_score real,
  ai_reasoning text,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- User Profiles Table (Optional for Phase 4)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_topics text[],
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for articles (public read and insert)
CREATE POLICY "Public articles are viewable by everyone." 
ON articles FOR SELECT USING (true);

CREATE POLICY "Public articles are insertable by everyone." 
ON articles FOR INSERT WITH CHECK (true);

CREATE POLICY "Public articles are updatable by everyone." 
ON articles FOR UPDATE USING (true);

-- Create policies for user_profiles (users can read/update their own profile)
CREATE POLICY "Users can view own profile." 
ON user_profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
ON user_profiles FOR UPDATE USING (auth.uid() = id);

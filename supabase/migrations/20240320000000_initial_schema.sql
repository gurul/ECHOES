-- Drop existing tables and types if they exist
DROP TABLE IF EXISTS "Comment";
DROP TABLE IF EXISTS "Story";
DROP TYPE IF EXISTS theme;

-- Create enum for story themes
CREATE TYPE theme AS ENUM (
  'resilience',
  'love',
  'adventure',
  'wisdom',
  'family',
  'courage'
);

-- Create stories table
CREATE TABLE "Story" (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  theme theme NOT NULL,
  votes INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table with self-referencing foreign key for nested comments
CREATE TABLE "Comment" (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Anonymous',
  storyId BIGINT REFERENCES "Story"(id) ON DELETE CASCADE,
  parentId BIGINT REFERENCES "Comment"(id) ON DELETE CASCADE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_story_theme ON "Story"(theme);
CREATE INDEX idx_story_votes ON "Story"(votes);
CREATE INDEX idx_story_created_at ON "Story"(createdAt);
CREATE INDEX idx_comment_story_id ON "Comment"(storyId);
CREATE INDEX idx_comment_parent_id ON "Comment"(parentId);
CREATE INDEX idx_comment_created_at ON "Comment"(createdAt);

-- Enable Row Level Security (RLS)
ALTER TABLE "Story" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users" ON "Story"
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "Comment"
  FOR SELECT USING (true);

-- Create policies for insert access
CREATE POLICY "Enable insert access for all users" ON "Story"
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert access for all users" ON "Comment"
  FOR INSERT WITH CHECK (true);

-- Create policies for update access (for votes)
CREATE POLICY "Enable update access for all users" ON "Story"
  FOR UPDATE USING (true)
  WITH CHECK (true); 
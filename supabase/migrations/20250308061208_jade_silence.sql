/*
  # Create announcements table

  1. New Tables
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, required)
      - `type` (text, default 'info')
      - `active` (boolean, default true)
      - `created_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `announcements` table
    - Add policies for:
      - Public users can read active announcements
      - Authenticated users with admin role can manage announcements
*/

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policy for public users to read active announcements
CREATE POLICY "Public users can view active announcements"
  ON announcements
  FOR SELECT
  TO public
  USING (active = true);

-- Policy for admin users to manage announcements
CREATE POLICY "Admin users can manage announcements"
  ON announcements
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Insert some initial announcements
INSERT INTO announcements (title, content, type, active) VALUES
  ('Welcome to Taiwanese Farmer', 'Track real-time agricultural product prices and market trends across Taiwan.', 'info', true),
  ('Market Data Update Schedule', 'Price data is updated daily at 6:00 PM Taiwan time.', 'info', true),
  ('New Feature: Multi-language Support', 'The platform now supports 8 languages including Chinese, English, Japanese, Korean, Indonesian, Malay, Thai, and Vietnamese.', 'success', true);
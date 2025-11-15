-- Cinema Booking Database Schema
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Movies table
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  poster_url TEXT,
  synopsis TEXT,
  full_synopsis TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theatres table
CREATE TABLE theatres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rows INTEGER NOT NULL,
  seats_per_row INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id UUID REFERENCES movies(id),
  theatre_id UUID REFERENCES theatres(id),
  seat_ids TEXT[] NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) - Users can only see their own bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Public read access for movies and theatres
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE theatres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view movies"
  ON movies FOR SELECT
  USING (true);

CREATE POLICY "Public can view theatres"
  ON theatres FOR SELECT
  USING (true);

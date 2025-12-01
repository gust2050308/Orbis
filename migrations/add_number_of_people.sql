-- Add number_of_people column to purchases table
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS number_of_people INTEGER NOT NULL DEFAULT 1;

-- Add comment to the column
COMMENT ON COLUMN purchases.number_of_people IS 'Number of people included in this purchase/reservation';

-- You can run this on Supabase SQL Editor or via a migration tool
-- This migration is safe to run multiple times due to IF NOT EXISTS

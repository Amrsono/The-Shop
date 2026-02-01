-- Rewards System Database Schema
-- Phase 1: Foundation

-- 1. Add loyalty_points column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;

-- 2. Create loyalty_transactions table for audit trail
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    points_change INTEGER NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'admin_adjustment')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create rewards_config table for admin settings
CREATE TABLE IF NOT EXISTS rewards_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    points_per_le NUMERIC DEFAULT 1.0,
    redemption_rate NUMERIC DEFAULT 0.10,
    min_redemption_points INTEGER DEFAULT 100,
    max_discount_percentage INTEGER DEFAULT 50,
    enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 4. Insert default rewards configuration
INSERT INTO rewards_config (id, points_per_le, redemption_rate, min_redemption_points, max_discount_percentage, enabled)
VALUES (1, 1.0, 0.10, 100, 50, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Enable Row Level Security
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_config ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for loyalty_transactions
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
ON loyalty_transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only system/admin can insert transactions (will be handled via functions/admin)
CREATE POLICY "Only authenticated users can insert transactions"
ON loyalty_transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 7. RLS Policies for rewards_config
-- Everyone can read config
CREATE POLICY "Anyone can view rewards config"
ON rewards_config FOR SELECT
TO public
USING (true);

-- Only admins can update config (check via profiles.role)
CREATE POLICY "Only admins can update rewards config"
ON rewards_config FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- 8. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_created_at ON loyalty_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_order_id ON loyalty_transactions(order_id);

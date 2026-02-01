-- Add snapshot columns to order_items
-- This ensures that even if products change, the order history remains accurate.

ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS image TEXT;

-- (Optional) If you want to backfill existing items (which are mock/test anyway), you could try:
-- UPDATE public.order_items SET name = 'Unknown Item', image = '/placeholder.png' WHERE name IS NULL;

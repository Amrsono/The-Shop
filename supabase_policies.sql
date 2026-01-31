-- Enable Row Level Security on the tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Policies for 'orders' table
-- ==========================================

-- 1. Allow public insert (Required for Guest Checkout and User Checkout)
-- This allows anyone (authenticated or anonymous) to insert a new order.
CREATE POLICY "Allow public insert on orders"
ON orders FOR INSERT
TO public
WITH CHECK (true);

-- 2. Allow users to view their own orders
-- This allows authenticated users to see orders where the user_id matches their ID.
CREATE POLICY "Allow users to view own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Allow admins to view all orders
-- This assumes you have a 'profiles' table with a 'role' column.
-- It checks if the current user has the 'admin' role.
CREATE POLICY "Allow admins to view all orders"
ON orders FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ==========================================
-- Policies for 'order_items' table
-- ==========================================

-- 1. Allow public insert (Required for creating order items during checkout)
CREATE POLICY "Allow public insert on order_items"
ON order_items FOR INSERT
TO public
WITH CHECK (true);

-- 2. Allow users to view items belonging to their orders
-- Users can see items if they can see the parent order.
CREATE POLICY "Allow users to view own order items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- 3. Allow admins to view all order items
CREATE POLICY "Allow admins to view all order items"
ON order_items FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

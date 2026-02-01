ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 1. Allow Public Read (Everyone can see products)
CREATE POLICY "Allow public read on products"
ON products FOR SELECT
TO public
USING (true);

-- 2. Allow Admins to Insert (Add Products)
CREATE POLICY "Allow admins to insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 3. Allow Admins to Update (Edit Products)
CREATE POLICY "Allow admins to update products"
ON products FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 4. Allow Admins to Delete (Remove Products)
CREATE POLICY "Allow admins to delete products"
ON products FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

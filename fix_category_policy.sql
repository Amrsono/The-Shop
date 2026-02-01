-- Enable RLS on categories (good practice)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read categories
CREATE POLICY "Allow public read on categories"
ON categories FOR SELECT
TO public
USING (true);

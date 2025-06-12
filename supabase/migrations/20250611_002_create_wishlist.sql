-- Create function for updating timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create enum for wishlist item status
CREATE TYPE wishlist_status AS ENUM (
  'pending',
  'ordered',
  'received'
);

-- Create wishlist table
CREATE TABLE wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  observations TEXT,
  customer_name TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  status wishlist_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read for authenticated users"
  ON wishlist_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON wishlist_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON wishlist_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON wishlist_items FOR DELETE
  TO authenticated
  USING (true);

-- Grant permissions
GRANT ALL ON wishlist_items TO authenticated;

-- Create updated_at trigger
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON wishlist_items
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

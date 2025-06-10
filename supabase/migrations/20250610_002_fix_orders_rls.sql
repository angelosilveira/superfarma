-- Enable row level security
alter table orders enable row level security;

-- Create policy to allow all operations for authenticated users
create policy "Enable all operations for authenticated users"
on orders
for all
to authenticated
using (true)
with check (true);

-- Update orders table to include user_id column
alter table orders
add column if not exists user_id uuid references auth.users(id) default auth.uid();

-- Add created_by column to track who created the order
alter table orders
add column if not exists created_by uuid references auth.users(id) default auth.uid();

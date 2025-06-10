-- Dependencies:
--  - 20250610_create_categories.sql

-- Create customers table
create table if not exists public.customers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  address text,
  cpf text,
  status text not null default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null default 0,
  stock integer not null default 0,
  category_id uuid references public.categories(id),
  status text not null default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references public.customers(id) not null,
  status text not null default 'pending',
  total_amount decimal(10,2) not null default 0,
  paid_amount decimal(10,2) not null default 0,
  remaining_amount decimal(10,2) not null default 0,
  payment_status text not null default 'pending',
  delivery_address text,
  delivery_notes text,
  observations text,
  delivery_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order items table
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null default 1,
  unit_price decimal(10,2) not null default 0,
  total decimal(10,2) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Create RLS policies
create policy "Enable read access for all users" on public.customers
  for select using (true);

create policy "Enable read access for all users" on public.products
  for select using (true);

create policy "Enable insert for authenticated users only" on public.products
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.products
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.products
  for delete using (auth.role() = 'authenticated');

create policy "Enable read access for all users" on public.orders
  for select using (true);

create policy "Enable insert for authenticated users only" on public.orders
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.orders
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.orders
  for delete using (auth.role() = 'authenticated');

create policy "Enable read access for all users" on public.order_items
  for select using (true);

create policy "Enable insert for authenticated users only" on public.order_items
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.order_items
  for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.order_items
  for delete using (auth.role() = 'authenticated');

-- Create computed column for remaining_amount
create or replace function public.compute_remaining_amount()
returns trigger as $$
begin
  new.remaining_amount := new.total_amount - new.paid_amount;
  if new.remaining_amount <= 0 then
    new.payment_status := 'paid';
  elsif new.paid_amount > 0 then
    new.payment_status := 'partial';
  else
    new.payment_status := 'pending';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger compute_order_remaining_amount
before insert or update on public.orders
for each row
execute function public.compute_remaining_amount();

-- Create enum for order categories
create type order_category as enum (
  'MEDICAMENTO',
  'GENERICO',
  'SIMILAR',
  'PERFUMARIA',
  'OUTROS'
);

-- Create enum for order status
create type order_status as enum (
  'pending',
  'processing',
  'delivered',
  'cancelled'
);

-- Create enum for payment status
create type payment_status as enum (
  'pending',
  'paid',
  'partial',
  'cancelled'
);

-- Create orders table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  customer text not null,
  customer_phone text,
  category order_category not null default 'MEDICAMENTO',
  order_cost decimal(10,2) not null default 0,
  paid_amount decimal(10,2) not null default 0,
  remaining_amount decimal(10,2) generated always as (total_amount - paid_amount) stored,
  total_amount decimal(10,2) not null default 0,
  delivery_date date not null,
  street text not null,
  number text,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  delivery_notes text,
  observations text,
  status order_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create order items table
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity integer not null,
  unit_price decimal(10,2) not null,
  total decimal(10,2) generated always as (quantity * unit_price) stored,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Function to update orders total_amount
create or replace function update_order_total()
returns trigger as $$
begin
  update orders
  set total_amount = (
    select coalesce(sum(total), 0)
    from order_items
    where order_id = new.order_id
  )
  where id = new.order_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to update orders total_amount when order items change
create trigger update_order_total
after insert or update or delete on order_items
for each row execute function update_order_total();

-- Function to update orders payment_status
create or replace function update_payment_status()
returns trigger as $$
begin
  -- If paid_amount is 0, status is 'pending'
  if new.paid_amount = 0 then
    new.payment_status := 'pending';
  -- If paid_amount equals total_amount, status is 'paid'  
  elsif new.paid_amount >= new.total_amount then
    new.payment_status := 'paid';
  -- If paid_amount is between 0 and total_amount, status is 'partial'
  elsif new.paid_amount > 0 then
    new.payment_status := 'partial';
  end if;
  return new;
end;
$$ language plpgsql;

-- Trigger to update payment_status when paid_amount changes
create trigger update_payment_status
before update of paid_amount on orders
for each row execute function update_payment_status();

-- Update timestamps function
create or replace function update_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Update timestamps triggers
create trigger update_orders_timestamp
before update on orders
for each row execute function update_timestamp();

create trigger update_order_items_timestamp
before update on order_items
for each row execute function update_timestamp();

-- Row Level Security (RLS)
alter table orders enable row level security;
alter table order_items enable row level security;

-- Policies
create policy "Enable all access for authenticated users" on orders
  for all
  to authenticated
  using (true);

create policy "Enable all access for authenticated users" on order_items
  for all
  to authenticated
  using (true);

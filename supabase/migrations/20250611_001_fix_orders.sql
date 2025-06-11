-- Drop existing tables
drop table if exists order_items;
drop table if exists orders;

-- Create orders table
create table orders (
    id uuid primary key default gen_random_uuid(),
    customer text not null,
    customer_phone text,
    delivery_date date not null,
    street text not null,
    number text,
    complement text,
    neighborhood text,
    delivery_notes text,
    observations text,
    status text default 'pending',
    payment_status text default 'pending',
    paid_amount numeric(10,2) default 0,
    total_amount numeric(10,2) generated always as (
      (select coalesce(sum(quantity * unit_price), 0) from order_items where order_id = id)
    ) stored,
    remaining_amount numeric(10,2) generated always as (
      (select coalesce(sum(quantity * unit_price), 0) from order_items where order_id = id) - paid_amount
    ) stored,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create order items table
create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    product_id text,
    product_name text not null,
    category text not null,
    quantity integer not null,
    unit_price numeric(10,2) not null,
    total numeric(10,2) generated always as (quantity * unit_price) stored,
    created_at timestamp with time zone default now()
);

-- Function to update timestamps
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to update timestamp
create trigger update_orders_timestamp
before update on orders
for each row execute function update_updated_at();

-- Update payment_status when paid_amount changes
create or replace function update_payment_status()
returns trigger as $$
begin
  if new.paid_amount = 0 then
    new.payment_status := 'pending';
  elsif new.paid_amount >= new.total_amount then
    new.payment_status := 'paid';
  else
    new.payment_status := 'partial';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger update_payment_status
before update of paid_amount on orders
for each row execute function update_payment_status();

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create RLS policies for orders
create policy "Enable read for authenticated users"
on orders for select
to authenticated
using (auth.uid() is not null);

create policy "Enable insert for authenticated users"
on orders for insert
to authenticated
with check (auth.uid() is not null);

create policy "Enable update for authenticated users"
on orders for update
to authenticated
using (auth.uid() is not null);

create policy "Enable delete for authenticated users"
on orders for delete
to authenticated
using (auth.uid() is not null);

-- Create RLS policies for order_items
create policy "Enable read for authenticated users"
on order_items for select
to authenticated
using (auth.uid() is not null);

create policy "Enable insert for authenticated users"
on order_items for insert
to authenticated
with check (auth.uid() is not null);

create policy "Enable update for authenticated users"
on order_items for update
to authenticated
using (auth.uid() is not null);

create policy "Enable delete for authenticated users"
on order_items for delete
to authenticated
using (auth.uid() is not null);

-- Grant permissions
grant usage on schema public to authenticated;
grant all on orders to authenticated;
grant all on order_items to authenticated;
grant usage on all sequences in schema public to authenticated;

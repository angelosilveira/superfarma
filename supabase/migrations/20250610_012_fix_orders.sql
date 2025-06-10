-- Drop existing tables and triggers
drop trigger if exists update_order_total on order_items;
drop trigger if exists update_payment_status on orders;
drop trigger if exists update_orders_timestamp on orders;
drop trigger if exists update_order_items_timestamp on order_items;
drop function if exists update_order_total();
drop function if exists update_payment_status();
drop function if exists update_timestamp();
drop table if exists order_items;
drop table if exists orders;

-- Create orders table with simplified structure
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
    total_amount numeric(10,2) default 0,
    remaining_amount numeric(10,2) default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create order items table with simplified structure
create table order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references orders(id) on delete cascade,
    product_id text,
    product_name text not null,
    category text not null,
    quantity integer not null,
    unit_price numeric(10,2) not null,
    total numeric(10,2) generated always as (quantity * unit_price) stored,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Function to update orders total_amount
create or replace function update_order_total()
returns trigger as $$
begin
  -- Calculate the total from order items
  update orders
  set total_amount = (
    select coalesce(sum(quantity * unit_price), 0)
    from order_items
    where order_id = new.order_id
  ),
  remaining_amount = (
    select coalesce(sum(quantity * unit_price), 0) - paid_amount
    from order_items
    where order_id = new.order_id
  ),
  payment_status = case
    when paid_amount <= 0 then 'pending'
    when paid_amount >= (select coalesce(sum(quantity * unit_price), 0) from order_items where order_id = new.order_id) then 'paid'
    else 'partial'
  end
  where id = new.order_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to update orders total_amount when order items change
create trigger update_order_total
after insert or update or delete on order_items
for each row execute function update_order_total();

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

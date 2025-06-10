-- Drop existing tables if they exist
drop table if exists order_items;
drop table if exists orders;

-- Create orders table
create table orders (
  id uuid default uuid_generate_v4() primary key,
  customer text not null,
  customer_phone text,
  delivery_date date not null,
  street text not null,
  number text,
  complement text,
  neighborhood text not null,
  delivery_notes text,
  observations text,
  status text not null default 'pending',
  payment_status text not null default 'pending',
  paid_amount numeric(10,2) not null default 0,
  remaining_amount numeric(10,2) not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) default auth.uid(),
  created_by uuid references auth.users(id) default auth.uid()
);

-- Create order_items table
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id text,
  product_name text not null,
  category text not null,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  total numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders_total_remaining function
create or replace function calculate_order_remaining()
returns trigger as $$
begin
  -- Calculate the total from order items
  with order_total as (
    select sum(total) as total_amount
    from order_items
    where order_id = NEW.id
  )
  update orders
  set remaining_amount = (select total_amount from order_total) - NEW.paid_amount
  where id = NEW.id;
  return NEW;
end;
$$ language plpgsql;

-- Create trigger for orders_total_remaining
create trigger update_order_remaining
after insert or update of paid_amount on orders
for each row
execute function calculate_order_remaining();

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create policies
create policy "Enable all operations for authenticated users" on orders
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Enable all operations for authenticated users" on order_items
  for all
  to authenticated
  using (true)
  with check (true);

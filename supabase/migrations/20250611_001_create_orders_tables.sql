-- Drop existing tables if they exist
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
    total_amount numeric(10,2) default 0,
    remaining_amount numeric(10,2) generated always as (total_amount - paid_amount) stored,
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
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create function to update order total
create or replace function update_order_total()
returns trigger as $$
begin
    update orders
    set total_amount = (
        select coalesce(sum(quantity * unit_price), 0)
        from order_items
        where order_id = NEW.order_id
    )
    where id = NEW.order_id;
    return NEW;
end;
$$ language plpgsql;

-- Create trigger to update order total when items change
create trigger update_order_total
after insert or update or delete on order_items
for each row execute function update_order_total();

-- Create function to update order payment status
create or replace function update_payment_status()
returns trigger as $$
begin
    update orders
    set payment_status = case
        when NEW.paid_amount >= total_amount then 'paid'
        when NEW.paid_amount > 0 then 'partial'
        else 'pending'
    end
    where id = NEW.id;
    return NEW;
end;
$$ language plpgsql;

-- Create trigger to update payment status when paid amount changes
create trigger update_payment_status
after update of paid_amount on orders
for each row execute function update_payment_status();

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create policies for orders
create policy "Enable all operations for authenticated users"
on orders for all
to authenticated
using (true)
with check (true);

-- Create policies for order_items
create policy "Enable all operations for authenticated users"
on order_items for all
to authenticated
using (true)
with check (true);

-- Grant permissions
grant usage on schema public to authenticated;
grant all on orders to authenticated;
grant all on order_items to authenticated;
grant usage on all sequences in schema public to authenticated;

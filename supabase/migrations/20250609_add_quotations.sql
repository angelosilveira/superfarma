-- Create suppliers table
create table if not exists suppliers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text,
  cnpj text unique,
  address text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create quotation_requests table
create table if not exists quotation_requests (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  product_name text not null,
  quantity integer not null,
  unit text not null,
  specifications text,
  deadline_date timestamptz not null,
  status text default 'draft',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create quotations table
create table if not exists quotations (
  id uuid default gen_random_uuid() primary key,
  quotation_request_id uuid references quotation_requests(id) on delete cascade,
  supplier_id uuid references suppliers(id) on delete cascade,
  unit_price decimal(10,2) not null,
  total_price decimal(10,2) not null,
  delivery_days integer,
  payment_terms text,
  notes text,
  is_winner boolean default false,
  status text default 'pending',
  valid_until timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add triggers for updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_suppliers_updated_at
  before update on suppliers
  for each row
  execute function update_updated_at();

create trigger update_quotation_requests_updated_at
  before update on quotation_requests
  for each row
  execute function update_updated_at();

create trigger update_quotations_updated_at
  before update on quotations
  for each row
  execute function update_updated_at();

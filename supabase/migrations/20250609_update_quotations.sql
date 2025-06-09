-- Update quotations table
alter table public.quotations
  drop column quotation_request_id,
  drop column delivery_days,
  drop column payment_terms,
  drop column is_winner,
  add column product_id uuid references public.products(id) on delete cascade,
  add column quantity integer not null default 1,
  alter column unit_price rename to price,
  alter column status set data type text using status::text,
  alter column status add constraint quotation_status_check check (status in ('pending', 'approved', 'rejected'));

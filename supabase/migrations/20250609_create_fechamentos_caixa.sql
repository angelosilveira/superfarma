create table if not exists public.fechamentos_caixa (
  id uuid default gen_random_uuid() primary key,
  responsavel text not null,
  data date not null default now(),
  valor_inicial decimal(10,2) not null default 0,
  dinheiro decimal(10,2) not null default 0,
  pix decimal(10,2) not null default 0,
  cartao_credito decimal(10,2) not null default 0,
  cartao_debito decimal(10,2) not null default 0,
  total decimal(10,2) not null default 0,
  diferenca decimal(10,2) not null default 0,
  observacoes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.fechamentos_caixa enable row level security;

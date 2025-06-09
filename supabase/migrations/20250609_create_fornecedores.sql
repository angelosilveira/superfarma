-- Create a table for storing fornecedores
create table fornecedores (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  empresa text not null,
  contato text,
  email text,
  created_at timestamp with time zone default now() not null
);

-- Create an index for faster searches by nome
create index fornecedores_nome_idx on fornecedores(nome);

-- Enable Row Level Security (RLS)
alter table fornecedores enable row level security;

-- Create a policy that allows all operations for all users (including anonymous)
create policy "Enable all operations for all users" on fornecedores
  for all
  to anon, authenticated
  using (true)
  with check (true);

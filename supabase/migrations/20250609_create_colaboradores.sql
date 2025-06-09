-- Create a table for storing colaboradores
create table colaboradores (
  id uuid default gen_random_uuid() primary key,
  nome text not null,
  email text,
  telefone text,
  cargo text not null,
  data_admissao date not null,
  created_at timestamp with time zone default now() not null
);

-- Create an index for faster searches by nome
create index colaboradores_nome_idx on colaboradores(nome);

-- Enable Row Level Security (RLS)
alter table colaboradores enable row level security;

-- Create a policy that allows all operations for all users (including anonymous)
create policy "Enable all operations for all users" on colaboradores
  for all
  to anon, authenticated
  using (true)
  with check (true);

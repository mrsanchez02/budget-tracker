-- Enable extensions
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- Tables
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  type text not null check (type in ('expense','income')),
  created_at timestamptz default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric(12,2) not null check (amount > 0),
  occurred_on date not null,
  note text,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_categories_user on public.categories(user_id);
create index if not exists idx_transactions_user on public.transactions(user_id);
create index if not exists idx_transactions_date on public.transactions(occurred_on);

-- RLS
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- Policies: users can only see/modify their rows
drop policy if exists "Categories select" on public.categories;
create policy "Categories select" on public.categories
  for select using ( auth.uid() = user_id );

drop policy if exists "Categories insert" on public.categories;
create policy "Categories insert" on public.categories
  for insert with check ( auth.uid() = user_id );

drop policy if exists "Categories update" on public.categories;
create policy "Categories update" on public.categories
  for update using ( auth.uid() = user_id );

drop policy if exists "Categories delete" on public.categories;
create policy "Categories delete" on public.categories
  for delete using ( auth.uid() = user_id );

drop policy if exists "Transactions select" on public.transactions;
create policy "Transactions select" on public.transactions
  for select using ( auth.uid() = user_id );

drop policy if exists "Transactions insert" on public.transactions;
create policy "Transactions insert" on public.transactions
  for insert with check ( auth.uid() = user_id );

drop policy if exists "Transactions update" on public.transactions;
create policy "Transactions update" on public.transactions
  for update using ( auth.uid() = user_id );

drop policy if exists "Transactions delete" on public.transactions;
create policy "Transactions delete" on public.transactions
  for delete using ( auth.uid() = user_id );

-- Run this in your Supabase SQL editor

create table if not exists exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  body_part text not null,
  target text not null,
  equipment text not null default 'body weight',
  instructions text[] not null default '{}',
  secondary_muscles text[] not null default '{}',
  description text,
  created_at timestamptz default now()
);

alter table exercises enable row level security;

create policy "Auth users can read exercises" on exercises
  for select using (auth.uid() is not null);

create policy "Auth users can insert exercises" on exercises
  for insert with check (auth.uid() is not null);

create policy "Auth users can update exercises" on exercises
  for update using (auth.uid() is not null);

create policy "Auth users can delete exercises" on exercises
  for delete using (auth.uid() is not null);

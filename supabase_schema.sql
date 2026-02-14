-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table that mirrors auth.users
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Create a trigger to automatically create a profile for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create loan_evaluations table
create table public.loan_evaluations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  financial_data jsonb not null,
  sustainability_data jsonb not null,
  result jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for loan_evaluations
alter table public.loan_evaluations enable row level security;

create policy "Users can view their own evaluations"
  on public.loan_evaluations for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own evaluations"
  on public.loan_evaluations for insert
  with check ( auth.uid() = user_id );

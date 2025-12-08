-- Create the submissions table
create table submissions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  content text not null
);

-- Enable Row Level Security (RLS)
alter table submissions enable row level security;

-- Create a policy that allows anyone to insert (submission)
create policy "Enable insert for everyone" on submissions for insert with check (true);

-- Create a policy that allows only authenticated users (or everyone if you want public admin) to select
-- For simplicity in this "ship it" mode, we'll allow public select but you should secure this later
create policy "Enable select for everyone" on submissions for select using (true);

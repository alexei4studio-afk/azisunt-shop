-- Products
create table products (
  id uuid default uuid() primary key,
  slug text unique not null,
  name text not null,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  category text not null,
  description text,
  is_viral boolean default false,
  badge text,
  sort_order int default 0,
  created_at timestamp default now()
);

-- Product Images
create table product_images (
  id uuid default uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  url text not null,
  alt_text text,
  position int default 0,
  is_primary boolean default false
);

-- Categories
create table categories (
  id uuid default uuid() primary key,
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  sort_order int default 0
);

-- Site Config
create table site_config (
  key text primary key,
  value jsonb
);

-- RLS Policies
alter table products enable row level security;
alter table product_images enable row level security;
create policy "Public can view" on products for select using (true);
create policy "Admin can manage" on products 
  using (auth.uid() in (select id from auth.users where (raw_user_meta_data->>'is_admin')::boolean = true))
  with check (auth.uid() in (select id from auth.users where (raw_user_meta_data->>'is_admin')::boolean = true));

-- Note: Admin operations in the admin dashboard use the service role key (supabaseAdmin)
-- which bypasses RLS entirely. The anon key is only used for public read operations.
-- For admin users, ensure their auth.users entry has raw_user_meta_data->>'is_admin' = 'true'
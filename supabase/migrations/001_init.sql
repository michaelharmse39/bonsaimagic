-- Run this in your Supabase project: Dashboard → SQL Editor → New query

-- ============================================================
-- PROFILES  (replaces Sanity "user" documents)
-- ============================================================
create table if not exists profiles (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  first_name    text,
  last_name     text,
  phone         text,
  password_hash text,
  google_id     text,
  created_at    timestamptz default now()
);

-- ============================================================
-- ADDRESSES  (new — saved addresses per user)
-- ============================================================
create table if not exists addresses (
  id          uuid primary key default gen_random_uuid(),
  user_email  text not null,
  name        text,
  street      text,
  suburb      text,
  city        text,
  province    text,
  postal_code text,
  country     text default 'South Africa',
  phone       text,
  is_default  boolean default false,
  created_at  timestamptz default now()
);

-- ============================================================
-- ORDERS  (replaces Sanity "order" documents)
-- ============================================================
create table if not exists orders (
  id                      uuid primary key default gen_random_uuid(),
  order_id                text unique not null,
  status                  text not null default 'pending',
  customer_email          text not null,
  customer_first_name     text,
  customer_last_name      text,
  customer_phone          text,
  shipping_street         text,
  shipping_suburb         text,
  shipping_city           text,
  shipping_province       text,
  shipping_postal_code    text,
  subtotal                numeric(10,2),
  shipping_cost           numeric(10,2),
  total                   numeric(10,2),
  payfast_payment_id      text,
  courier_guy_tracking_id text,
  notes                   text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- ============================================================
-- ORDER ITEMS  (normalised line items)
-- ============================================================
create table if not exists order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  product_id text,
  name       text not null,
  price      numeric(10,2) not null,
  quantity   int  not null
);

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists idx_profiles_email       on profiles(email);
create index if not exists idx_orders_customer_email on orders(customer_email);
create index if not exists idx_orders_order_id       on orders(order_id);
create index if not exists idx_order_items_order_id  on order_items(order_id);
create index if not exists idx_addresses_user_email  on addresses(user_email);

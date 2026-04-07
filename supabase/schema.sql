create table if not exists intake_sessions (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  birth_date text not null,
  birth_time text,
  birth_city text,
  focus_theme text not null,
  consent_entertainment_disclaimer boolean not null,
  email text,
  preview jsonb not null,
  report_id text,
  latest_order_id text
);

create table if not exists orders (
  id text primary key,
  intake_session_id text not null references intake_sessions (id),
  report_id text,
  email text not null,
  sku jsonb not null,
  stripe_session_id text not null unique,
  payment_status text not null,
  report_status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reports (
  id text primary key,
  intake_session_id text not null references intake_sessions (id),
  order_id text not null references orders (id),
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null,
  element_profile jsonb not null,
  receipt jsonb,
  disclaimer text not null,
  assets jsonb not null default '[]'::jsonb,
  error text
);

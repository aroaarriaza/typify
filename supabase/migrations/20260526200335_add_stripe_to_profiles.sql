alter table public.profiles
  add column stripe_customer_id text unique,
  add column stripe_subscription_id text unique;

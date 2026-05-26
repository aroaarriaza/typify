-- Tabla de perfiles: un perfil por usuario
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  plan         text not null default 'free' check (plan in ('free', 'pro')),
  credits      integer not null default 10,
  created_at   timestamptz not null default now()
);

-- Tabla de generaciones: historial de textos generados
create table public.generations (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  prompt     text not null,
  result     text not null,
  created_at timestamptz not null default now()
);

-- RLS: activar seguridad por fila
alter table public.profiles enable row level security;
alter table public.generations enable row level security;

-- Políticas de profiles: cada usuario solo ve y edita su propio perfil
create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- Políticas de generations: cada usuario solo ve sus propias generaciones
create policy "generations: select own" on public.generations
  for select using (auth.uid() = user_id);

create policy "generations: insert own" on public.generations
  for insert with check (auth.uid() = user_id);

-- Trigger: crear perfil automáticamente al registrarse un usuario
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

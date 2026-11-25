create table if not exists public.article_likes (
  id uuid primary key default gen_random_uuid(),
  article_id text not null references public.blog_posts(id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  constraint article_likes_one_per_visitor unique (article_id, visitor_id)
);
create index if not exists article_likes_article_id_idx on public.article_likes(article_id);

create table if not exists public.article_comments (
  id uuid primary key default gen_random_uuid(),
  article_id text not null references public.blog_posts(id) on delete cascade,
  visitor_id uuid not null,
  display_name text not null check (char_length(trim(display_name)) between 1 and 60),
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists article_comments_article_created_idx on public.article_comments(article_id, created_at desc);

create table if not exists public.article_shares (
  id uuid primary key default gen_random_uuid(),
  article_id text not null references public.blog_posts(id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now()
);
create index if not exists article_shares_article_id_idx on public.article_shares(article_id);

alter table public.article_likes enable row level security;
alter table public.article_comments enable row level security;
alter table public.article_shares enable row level security;

grant select, insert, delete on public.article_likes to anon, authenticated;
grant select, insert on public.article_comments to anon, authenticated;
grant select, insert on public.article_shares to anon, authenticated;

create policy "Public can read article likes" on public.article_likes
for select to anon, authenticated using (true);
create policy "Visitors can like articles" on public.article_likes
for insert to anon, authenticated with check (true);
create policy "Visitors can remove their own article likes" on public.article_likes
for delete to anon, authenticated using (true);

create policy "Public can read article comments" on public.article_comments
for select to anon, authenticated using (true);
create policy "Visitors can comment on articles" on public.article_comments
for insert to anon, authenticated with check (
  char_length(trim(display_name)) between 1 and 60
  and char_length(trim(body)) between 1 and 2000
);

create policy "Public can read article shares" on public.article_shares
for select to anon, authenticated using (true);
create policy "Visitors can record article shares" on public.article_shares
for insert to anon, authenticated with check (true);

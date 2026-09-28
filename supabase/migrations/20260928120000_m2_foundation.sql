-- JogaMais M2: persistência multi-tenant, autorização e cadastros essenciais.
create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon;

create type public.membership_role as enum ('coordinator', 'coach', 'guardian');
create type public.record_status as enum ('active', 'inactive');
create type public.invitation_status as enum ('pending', 'accepted', 'expired', 'revoked');
create type public.assessment_status as enum ('draft', 'submitted', 'published', 'returned');
create type public.goal_status as enum ('active', 'completed', 'cancelled');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 2 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  role public.membership_role not null,
  invitation_id uuid,
  status public.record_status not null default 'active',
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, user_id, role),
  unique (invitation_id),
  check (role = 'coordinator' or invitation_id is not null),
  check ((status = 'active' and accepted_at is not null and revoked_at is null) or status = 'inactive')
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  email text not null check (email = lower(trim(email))),
  role public.membership_role not null,
  status public.invitation_status not null default 'pending',
  token_hash text not null unique,
  invited_by_user_id uuid not null references auth.users(id) on delete restrict,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  check (expires_at > created_at)
);

alter table public.memberships
  add foreign key (organization_id, invitation_id)
  references public.invitations(organization_id, id) on delete restrict;

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null check (char_length(trim(name)) between 2 and 80),
  starts_on date not null,
  ends_on date not null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, name),
  check (ends_on >= starts_on)
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  season_id uuid not null,
  name text not null check (char_length(trim(name)) between 2 and 80),
  age_category text not null check (char_length(trim(age_category)) between 2 and 40),
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, season_id, name),
  foreign key (organization_id, season_id) references public.seasons(organization_id, id) on delete restrict
);

create table public.team_coaches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  team_id uuid not null,
  membership_id uuid not null,
  active_from date not null default current_date,
  active_until date,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, team_id) references public.teams(organization_id, id) on delete restrict,
  foreign key (organization_id, membership_id) references public.memberships(organization_id, id) on delete restrict,
  check (active_until is null or active_until >= active_from)
);
create unique index team_coaches_one_active_assignment
  on public.team_coaches (organization_id, team_id, membership_id)
  where status = 'active';

create table public.athletes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  display_name text not null check (char_length(trim(display_name)) between 2 and 120),
  birth_date date,
  preferred_position text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id)
);

create table public.athlete_team_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  athlete_id uuid not null,
  team_id uuid not null,
  active_from date not null default current_date,
  active_until date,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, athlete_id) references public.athletes(organization_id, id) on delete restrict,
  foreign key (organization_id, team_id) references public.teams(organization_id, id) on delete restrict,
  check (active_until is null or active_until >= active_from)
);
create unique index athlete_team_one_active_assignment
  on public.athlete_team_memberships (organization_id, athlete_id, team_id)
  where status = 'active';

create table public.guardian_athletes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  guardian_membership_id uuid not null,
  athlete_id uuid not null,
  relationship text not null check (char_length(trim(relationship)) between 2 and 40),
  status public.record_status not null default 'active',
  linked_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, guardian_membership_id) references public.memberships(organization_id, id) on delete restrict,
  foreign key (organization_id, athlete_id) references public.athletes(organization_id, id) on delete restrict,
  check ((status = 'active' and revoked_at is null) or status = 'inactive')
);
create unique index guardian_athletes_one_active_link
  on public.guardian_athletes (organization_id, guardian_membership_id, athlete_id)
  where status = 'active';

create table public.methodology_versions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null,
  version integer not null check (version > 0),
  status public.record_status not null default 'active',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, name, version)
);

create table public.criteria (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  methodology_version_id uuid not null,
  criterion_key text not null,
  pillar text not null,
  label text not null,
  descriptors jsonb not null default '{}'::jsonb,
  applicability jsonb not null default '{}'::jsonb,
  required boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (methodology_version_id, criterion_key),
  foreign key (organization_id, methodology_version_id) references public.methodology_versions(organization_id, id) on delete restrict
);

create table public.assessment_cycles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  season_id uuid not null,
  methodology_version_id uuid not null,
  name text not null,
  starts_on date not null,
  ends_on date not null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, season_id) references public.seasons(organization_id, id) on delete restrict,
  foreign key (organization_id, methodology_version_id) references public.methodology_versions(organization_id, id) on delete restrict,
  check (ends_on >= starts_on)
);

create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  athlete_id uuid not null,
  team_id uuid not null,
  cycle_id uuid not null,
  author_membership_id uuid not null,
  status public.assessment_status not null default 'draft',
  final_comment text,
  published_at timestamptz,
  revision integer not null default 1 check (revision > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, athlete_id) references public.athletes(organization_id, id) on delete restrict,
  foreign key (organization_id, team_id) references public.teams(organization_id, id) on delete restrict,
  foreign key (organization_id, cycle_id) references public.assessment_cycles(organization_id, id) on delete restrict,
  foreign key (organization_id, author_membership_id) references public.memberships(organization_id, id) on delete restrict,
  check ((status = 'published' and published_at is not null) or (status <> 'published' and published_at is null))
);
create unique index assessments_one_published_per_cycle
  on public.assessments (organization_id, athlete_id, cycle_id)
  where status = 'published';

create table public.assessment_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  assessment_id uuid not null,
  criterion_id uuid not null,
  score smallint,
  not_observed_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (assessment_id, criterion_id),
  foreign key (organization_id, assessment_id) references public.assessments(organization_id, id) on delete cascade,
  foreign key (organization_id, criterion_id) references public.criteria(organization_id, id) on delete restrict,
  check ((score between 1 and 5 and not_observed_reason is null) or (score is null and char_length(trim(not_observed_reason)) >= 3))
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  athlete_id uuid not null,
  source_assessment_id uuid,
  criterion_id uuid,
  title text not null,
  action_plan text not null,
  target_date date,
  status public.goal_status not null default 'active',
  visible_to_guardians boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, athlete_id) references public.athletes(organization_id, id) on delete restrict,
  foreign key (organization_id, source_assessment_id) references public.assessments(organization_id, id) on delete restrict,
  foreign key (organization_id, criterion_id) references public.criteria(organization_id, id) on delete restrict
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  organization_id uuid references public.organizations(id) on delete restrict,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  changes jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create or replace function private.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.validate_membership_invitation()
returns trigger language plpgsql security definer set search_path = '' as $$
declare invitation_record public.invitations%rowtype;
declare invited_email text;
begin
  if new.role = 'coordinator' and new.invitation_id is null then return new; end if;
  select * into invitation_record from public.invitations where id = new.invitation_id;
  select lower(email) into invited_email from auth.users where id = new.user_id;
  if invitation_record.id is null
    or invitation_record.organization_id <> new.organization_id
    or invitation_record.role <> new.role
    or invitation_record.status <> 'accepted'
    or invitation_record.accepted_at is null
    or invitation_record.email <> invited_email then
    raise exception 'membership requires a matching accepted invitation';
  end if;
  return new;
end;
$$;

create trigger validate_membership_invitation
  before insert or update of organization_id, user_id, role, invitation_id
  on public.memberships for each row execute function private.validate_membership_invitation();

create or replace function private.validate_role_specific_link()
returns trigger language plpgsql security definer set search_path = '' as $$
declare membership_role_value public.membership_role;
begin
  select role into membership_role_value from public.memberships
    where organization_id = new.organization_id
      and id = (to_jsonb(new) ->> tg_argv[0])::uuid
      and status = 'active';
  if (tg_table_name = 'team_coaches' and membership_role_value is distinct from 'coach')
    or (tg_table_name = 'guardian_athletes' and membership_role_value is distinct from 'guardian') then
    raise exception 'membership role is not valid for this link';
  end if;
  return new;
end;
$$;

create trigger validate_team_coach_role before insert or update of organization_id, membership_id
  on public.team_coaches for each row execute function private.validate_role_specific_link('membership_id');
create trigger validate_guardian_role before insert or update of organization_id, guardian_membership_id
  on public.guardian_athletes for each row execute function private.validate_role_specific_link('guardian_membership_id');

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles','organizations','memberships','seasons','teams','team_coaches','athletes','athlete_team_memberships','guardian_athletes','assessments','assessment_scores','goals']
  loop
    execute format('create trigger touch_updated_at before update on public.%I for each row execute function private.touch_updated_at()', table_name);
  end loop;
end $$;

create or replace function private.is_active_member(target_organization_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = target_organization_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.accepted_at is not null
      and m.revoked_at is null
  );
$$;

create or replace function private.has_role(target_organization_id uuid, allowed_roles public.membership_role[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = target_organization_id
      and m.user_id = auth.uid()
      and m.role = any(allowed_roles)
      and m.status = 'active'
      and m.accepted_at is not null
      and m.revoked_at is null
  );
$$;

create or replace function private.is_assigned_coach(target_organization_id uuid, target_team_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.memberships m
    join public.team_coaches tc
      on tc.organization_id = m.organization_id and tc.membership_id = m.id
    where m.organization_id = target_organization_id
      and m.user_id = auth.uid()
      and m.role = 'coach'
      and m.status = 'active'
      and m.accepted_at is not null
      and m.revoked_at is null
      and tc.team_id = target_team_id
      and tc.status = 'active'
      and tc.active_from <= current_date
      and (tc.active_until is null or tc.active_until >= current_date)
  );
$$;

create or replace function private.is_guardian_of(target_organization_id uuid, target_athlete_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.memberships m
    join public.guardian_athletes ga
      on ga.organization_id = m.organization_id and ga.guardian_membership_id = m.id
    where m.organization_id = target_organization_id
      and m.user_id = auth.uid()
      and m.role = 'guardian'
      and m.status = 'active'
      and m.accepted_at is not null
      and m.revoked_at is null
      and ga.athlete_id = target_athlete_id
      and ga.status = 'active'
      and ga.revoked_at is null
  );
$$;

create or replace function private.can_read_assessment(target_assessment_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.assessments a
    where a.id = target_assessment_id and (
      private.has_role(a.organization_id, array['coordinator']::public.membership_role[])
      or private.is_assigned_coach(a.organization_id, a.team_id)
      or (a.status = 'published' and private.is_guardian_of(a.organization_id, a.athlete_id))
    )
  );
$$;

create or replace function public.bootstrap_organization(organization_name text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_organization_id uuid;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  if char_length(trim(organization_name)) not between 2 and 120 then raise exception 'invalid organization name'; end if;
  insert into public.organizations(name) values (trim(organization_name)) returning id into new_organization_id;
  insert into public.memberships(organization_id, user_id, role, status, accepted_at)
    values (new_organization_id, auth.uid(), 'coordinator', 'active', now());
  return new_organization_id;
end;
$$;

create or replace function public.issue_invitation(
  target_organization_id uuid,
  invited_email text,
  invited_role public.membership_role
)
returns table (invitation_id uuid, invitation_token text)
language plpgsql security definer set search_path = '' as $$
declare raw_token text;
begin
  if not private.has_role(target_organization_id, array['coordinator']::public.membership_role[]) then
    raise exception 'coordinator role required';
  end if;
  if invited_role not in ('coach', 'guardian') then raise exception 'invalid invited role'; end if;
  if invited_email is null or invited_email <> lower(trim(invited_email)) or position('@' in invited_email) < 2 then
    raise exception 'invalid email';
  end if;
  raw_token := encode(extensions.gen_random_bytes(24), 'hex');
  insert into public.invitations (organization_id, email, role, token_hash, invited_by_user_id, expires_at)
    values (target_organization_id, invited_email, invited_role, encode(extensions.digest(raw_token, 'sha256'), 'hex'), auth.uid(), now() + interval '7 days')
    returning id into invitation_id;
  invitation_token := raw_token;
  return next;
end;
$$;

create or replace function public.accept_invitation(invitation_token text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare invitation_record public.invitations%rowtype;
declare authenticated_email text;
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;
  authenticated_email := lower(auth.jwt() ->> 'email');
  select * into invitation_record from public.invitations
    where token_hash = encode(extensions.digest(invitation_token, 'sha256'), 'hex')
      and status = 'pending' and expires_at > now()
    for update;
  if invitation_record.id is null or invitation_record.email <> authenticated_email then
    raise exception 'invalid or expired invitation';
  end if;
  update public.invitations set status = 'accepted', accepted_at = now() where id = invitation_record.id;
  insert into public.memberships (organization_id, user_id, role, invitation_id, status, accepted_at)
    values (invitation_record.organization_id, auth.uid(), invitation_record.role, invitation_record.id, 'active', now());
  return invitation_record.organization_id;
end;
$$;

create or replace function public.create_athlete_with_team(
  target_organization_id uuid,
  target_team_id uuid,
  athlete_display_name text,
  athlete_birth_date date default null,
  athlete_preferred_position text default null
)
returns uuid language plpgsql security definer set search_path = '' as $$
declare new_athlete_id uuid;
begin
  if not private.has_role(target_organization_id, array['coordinator']::public.membership_role[]) then
    raise exception 'coordinator role required';
  end if;
  if not exists (select 1 from public.teams where organization_id = target_organization_id and id = target_team_id and status = 'active') then
    raise exception 'active team not found';
  end if;
  insert into public.athletes (organization_id, display_name, birth_date, preferred_position)
    values (target_organization_id, trim(athlete_display_name), athlete_birth_date, nullif(trim(athlete_preferred_position), ''))
    returning id into new_athlete_id;
  insert into public.athlete_team_memberships (organization_id, athlete_id, team_id)
    values (target_organization_id, new_athlete_id, target_team_id);
  return new_athlete_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.invitations enable row level security;
alter table public.seasons enable row level security;
alter table public.teams enable row level security;
alter table public.team_coaches enable row level security;
alter table public.athletes enable row level security;
alter table public.athlete_team_memberships enable row level security;
alter table public.guardian_athletes enable row level security;
alter table public.methodology_versions enable row level security;
alter table public.criteria enable row level security;
alter table public.assessment_cycles enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_scores enable row level security;
alter table public.goals enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_select_self on public.profiles for select to authenticated using (user_id = auth.uid());
create policy profiles_insert_self on public.profiles for insert to authenticated with check (user_id = auth.uid());
create policy profiles_update_self on public.profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy organizations_select_member on public.organizations for select to authenticated using (private.is_active_member(id));
create policy organizations_update_coordinator on public.organizations for update to authenticated using (private.has_role(id, array['coordinator']::public.membership_role[])) with check (private.has_role(id, array['coordinator']::public.membership_role[]));

create policy memberships_select on public.memberships for select to authenticated using (user_id = auth.uid() or private.has_role(organization_id, array['coordinator']::public.membership_role[]));
create policy memberships_insert_coordinator on public.memberships for insert to authenticated with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));
create policy memberships_update_coordinator on public.memberships for update to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));

create policy invitations_coordinator_all on public.invitations for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));

create policy seasons_select_member on public.seasons for select to authenticated using (private.is_active_member(organization_id));
create policy seasons_write_coordinator on public.seasons for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));
create policy teams_select_member on public.teams for select to authenticated using (private.is_active_member(organization_id));
create policy teams_write_coordinator on public.teams for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));
create policy team_coaches_select_member on public.team_coaches for select to authenticated using (private.is_active_member(organization_id));
create policy team_coaches_write_coordinator on public.team_coaches for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));

create policy athletes_select_authorized on public.athletes for select to authenticated using (
  private.has_role(organization_id, array['coordinator']::public.membership_role[])
  or private.is_guardian_of(organization_id, id)
  or exists (
    select 1 from public.athlete_team_memberships atm
    where atm.organization_id = athletes.organization_id and atm.athlete_id = athletes.id
      and atm.status = 'active' and private.is_assigned_coach(atm.organization_id, atm.team_id)
  )
);
create policy athletes_write_coordinator on public.athletes for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));
create policy athlete_teams_select_authorized on public.athlete_team_memberships for select to authenticated using (
  private.has_role(organization_id, array['coordinator']::public.membership_role[])
  or private.is_assigned_coach(organization_id, team_id)
  or private.is_guardian_of(organization_id, athlete_id)
);
create policy athlete_teams_write_coordinator on public.athlete_team_memberships for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));
create policy guardian_links_select on public.guardian_athletes for select to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[]) or private.is_guardian_of(organization_id, athlete_id));
create policy guardian_links_write_coordinator on public.guardian_athletes for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));

create policy methodologies_select_member on public.methodology_versions for select to authenticated using (private.is_active_member(organization_id));
create policy methodologies_write_coordinator on public.methodology_versions for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));
create policy criteria_select_member on public.criteria for select to authenticated using (private.is_active_member(organization_id));
create policy criteria_write_coordinator on public.criteria for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));
create policy cycles_select_member on public.assessment_cycles for select to authenticated using (private.is_active_member(organization_id));
create policy cycles_write_coordinator on public.assessment_cycles for all to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[])) with check (private.has_role(organization_id, array['coordinator']::public.membership_role[]));

create policy assessments_select_authorized on public.assessments for select to authenticated using (
  private.has_role(organization_id, array['coordinator']::public.membership_role[])
  or private.is_assigned_coach(organization_id, team_id)
  or (status = 'published' and private.is_guardian_of(organization_id, athlete_id))
);
create policy assessments_insert_staff on public.assessments for insert to authenticated with check (
  private.has_role(organization_id, array['coordinator']::public.membership_role[])
  or (private.is_assigned_coach(organization_id, team_id) and exists (
    select 1 from public.memberships m where m.id = author_membership_id and m.user_id = auth.uid() and m.organization_id = assessments.organization_id and m.status = 'active'
  ))
);
create policy assessments_update_staff on public.assessments for update to authenticated using (
  private.has_role(organization_id, array['coordinator']::public.membership_role[])
  or (status in ('draft','returned') and private.is_assigned_coach(organization_id, team_id))
) with check (
  private.has_role(organization_id, array['coordinator']::public.membership_role[])
  or private.is_assigned_coach(organization_id, team_id)
);
create policy scores_select_authorized on public.assessment_scores for select to authenticated using (private.can_read_assessment(assessment_id));
create policy scores_write_staff on public.assessment_scores for all to authenticated using (
  exists (select 1 from public.assessments a where a.id = assessment_id and a.status in ('draft','returned') and (private.has_role(a.organization_id, array['coordinator']::public.membership_role[]) or private.is_assigned_coach(a.organization_id, a.team_id)))
) with check (
  exists (select 1 from public.assessments a where a.id = assessment_id and a.status in ('draft','returned') and (private.has_role(a.organization_id, array['coordinator']::public.membership_role[]) or private.is_assigned_coach(a.organization_id, a.team_id)))
);

create policy goals_select_authorized on public.goals for select to authenticated using (
  private.has_role(organization_id, array['coordinator']::public.membership_role[])
  or exists (select 1 from public.athlete_team_memberships atm where atm.organization_id = goals.organization_id and atm.athlete_id = goals.athlete_id and atm.status = 'active' and private.is_assigned_coach(atm.organization_id, atm.team_id))
  or (visible_to_guardians and private.is_guardian_of(organization_id, athlete_id))
);
create policy goals_write_staff on public.goals for all to authenticated using (
  private.has_role(organization_id, array['coordinator']::public.membership_role[])
  or exists (select 1 from public.athlete_team_memberships atm where atm.organization_id = goals.organization_id and atm.athlete_id = goals.athlete_id and atm.status = 'active' and private.is_assigned_coach(atm.organization_id, atm.team_id))
) with check (
  private.has_role(organization_id, array['coordinator']::public.membership_role[])
  or exists (select 1 from public.athlete_team_memberships atm where atm.organization_id = goals.organization_id and atm.athlete_id = goals.athlete_id and atm.status = 'active' and private.is_assigned_coach(atm.organization_id, atm.team_id))
);
create policy audit_select_coordinator on public.audit_events for select to authenticated using (private.has_role(organization_id, array['coordinator']::public.membership_role[]));

revoke all on all tables in schema public from anon;
revoke all on all tables in schema public from authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, update on public.organizations to authenticated;
grant select, insert, update on public.memberships, public.invitations, public.seasons, public.teams, public.team_coaches, public.athletes, public.athlete_team_memberships, public.guardian_athletes, public.methodology_versions, public.criteria, public.assessment_cycles, public.assessments, public.assessment_scores, public.goals to authenticated;
grant select on public.audit_events to authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_active_member(uuid), private.has_role(uuid, public.membership_role[]), private.is_assigned_coach(uuid, uuid), private.is_guardian_of(uuid, uuid), private.can_read_assessment(uuid) to authenticated;
revoke all on function public.bootstrap_organization(text) from public, anon;
grant execute on function public.bootstrap_organization(text) to authenticated;
revoke all on function public.issue_invitation(uuid, text, public.membership_role), public.accept_invitation(text), public.create_athlete_with_team(uuid, uuid, text, date, text) from public, anon;
grant execute on function public.issue_invitation(uuid, text, public.membership_role), public.accept_invitation(text), public.create_athlete_with_team(uuid, uuid, text, date, text) to authenticated;

create index memberships_user_active_idx on public.memberships (user_id, organization_id) where status = 'active';
create index team_coaches_team_active_idx on public.team_coaches (team_id, membership_id) where status = 'active';
create index athlete_teams_athlete_active_idx on public.athlete_team_memberships (athlete_id, team_id) where status = 'active';
create index guardian_athletes_guardian_active_idx on public.guardian_athletes (guardian_membership_id, athlete_id) where status = 'active';
create index assessments_athlete_cycle_idx on public.assessments (athlete_id, cycle_id, status);
create index audit_events_org_time_idx on public.audit_events (organization_id, occurred_at desc);

begin;

create extension if not exists pgtap with schema extensions;
select plan(10);

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'coordenador-a@example.test', crypt('Test123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'tecnico-a@example.test', crypt('Test123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'responsavel-a@example.test', crypt('Test123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'responsavel-sem-vinculo@example.test', crypt('Test123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'coordenador-b@example.test', crypt('Test123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());

insert into public.organizations (id, name) values
  ('20000000-0000-0000-0000-000000000001', 'Organização A'),
  ('20000000-0000-0000-0000-000000000002', 'Organização B');

insert into public.invitations (id, organization_id, email, role, status, token_hash, invited_by_user_id, expires_at, accepted_at) values
  ('21000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'tecnico-a@example.test', 'coach', 'accepted', 'hash-coach-a', '10000000-0000-0000-0000-000000000001', now() + interval '1 day', now()),
  ('21000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', 'responsavel-a@example.test', 'guardian', 'accepted', 'hash-guardian-a', '10000000-0000-0000-0000-000000000001', now() + interval '1 day', now()),
  ('21000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 'responsavel-sem-vinculo@example.test', 'guardian', 'accepted', 'hash-guardian-unlinked', '10000000-0000-0000-0000-000000000001', now() + interval '1 day', now());

insert into public.memberships (id, organization_id, user_id, role, invitation_id, accepted_at) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'coordinator', null, now()),
  ('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'coach', '21000000-0000-0000-0000-000000000002', now()),
  ('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'guardian', '21000000-0000-0000-0000-000000000003', now()),
  ('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'guardian', '21000000-0000-0000-0000-000000000004', now()),
  ('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 'coordinator', null, now());

insert into public.seasons (id, organization_id, name, starts_on, ends_on) values
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '2026', '2026-01-01', '2026-12-31'),
  ('40000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '2026', '2026-01-01', '2026-12-31');

insert into public.teams (id, organization_id, season_id, name, age_category) values
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Sub-11', 'Sub-11'),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Sub-13', 'Sub-13'),
  ('50000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'Sub-11', 'Sub-11');

insert into public.team_coaches (id, organization_id, team_id, membership_id) values
  ('60000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002');

insert into public.athletes (id, organization_id, display_name) values
  ('70000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Atleta A1'),
  ('70000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Atleta A2'),
  ('70000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Atleta B1');

insert into public.athlete_team_memberships (id, organization_id, athlete_id, team_id) values
  ('80000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001'),
  ('80000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002'),
  ('80000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000003');

insert into public.guardian_athletes (id, organization_id, guardian_membership_id, athlete_id, relationship) values
  ('90000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '70000000-0000-0000-0000-000000000001', 'Responsável');

insert into public.methodology_versions (id, organization_id, name, version) values
  ('a0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Metodologia teste', 1);
insert into public.assessment_cycles (id, organization_id, season_id, methodology_version_id, name, starts_on, ends_on) values
  ('b0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Ciclo 1', '2026-01-01', '2026-06-30');
insert into public.assessments (id, organization_id, athlete_id, team_id, cycle_id, author_membership_id, status, published_at) values
  ('c0000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'published', now()),
  ('c0000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'draft', null);

set local role authenticated;

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
select results_eq('select count(*)::bigint from public.athletes', array[1::bigint], 'coach sees athletes only in assigned teams');
select results_eq($$select count(*)::bigint from public.athletes where id = '70000000-0000-0000-0000-000000000002'$$, array[0::bigint], 'coach cannot see athlete in unassigned team');
select results_eq($$select count(*)::bigint from public.athletes where organization_id = '20000000-0000-0000-0000-000000000002'$$, array[0::bigint], 'coach cannot cross tenant boundary');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select results_eq('select count(*)::bigint from public.athletes', array[1::bigint], 'linked guardian sees linked athlete');
select results_eq($$select count(*)::bigint from public.assessments where status = 'published'$$, array[1::bigint], 'linked guardian sees published assessment');
select results_eq($$select count(*)::bigint from public.assessments where status = 'draft'$$, array[0::bigint], 'guardian cannot see draft assessment');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000004', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000004","role":"authenticated"}', true);
select results_eq('select count(*)::bigint from public.athletes', array[0::bigint], 'guardian without link sees no athlete');

set local role postgres;
select throws_ok(
  $$insert into public.athlete_team_memberships (organization_id, athlete_id, team_id) values ('20000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000003')$$,
  '23503',
  null,
  'composite foreign key rejects a cross-tenant relationship'
);
update public.guardian_athletes set status = 'inactive', revoked_at = now() where id = '90000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select results_eq('select count(*)::bigint from public.athletes', array[0::bigint], 'guardian revocation is effective immediately');

set local role postgres;
update public.team_coaches set status = 'inactive', active_until = current_date where id = '60000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
select results_eq('select count(*)::bigint from public.athletes', array[0::bigint], 'coach revocation is effective immediately');

select * from finish();
rollback;

-- =====================================================================
--  Sistema de Información · Violencia Contra la Mujer  (Lima y Callao)
--  Ejecutar en Supabase → SQL Editor → New query → Run
-- =====================================================================

create table if not exists public.casos_mensuales (
  id            bigint generated always as identity primary key,
  anio          int  not null,
  mes           int  not null,
  departamento  text,
  provincia     text,
  distrito      text,
  ubigeo        text,
  cantidad      int  not null
);

create table if not exists public.cem_atenciones (
  id            bigint generated always as identity primary key,
  anio          int  not null,
  ubigeo        text,
  departamento  text,
  provincia     text,
  distrito      text,
  centro        text,
  casos_total   int,
  hombres       int,
  mujeres       int,
  psicologica   int,
  fisica        int,
  sexual        int,
  edad_0_5      int,
  edad_6_11     int,
  edad_12_17    int,
  edad_18_25    int,
  edad_26_35    int,
  edad_36_45    int,
  edad_46_59    int,
  edad_60_mas   int,
  actividades   int
);

create table if not exists public.fiscalia_casos (
  id              bigint generated always as identity primary key,
  anio            int,
  distrito_fiscal text,
  tipo_fiscalia   text,
  materia         text,
  especialidad    text,
  tipo_caso       text,
  especializada   text,
  ingresado       int,
  atendido        int,
  ubigeo_pjfs     text,
  dpto_pjfs       text,
  prov_pjfs       text,
  dist_pjfs       text
);

create table if not exists public.familias_atendidas (
  id          bigint generated always as identity primary key,
  cod_fam     text,
  tip_fam     int,
  par_fam     int,
  sex_fam     int,
  edad        int,
  gru_et      int,
  tie_dis     int,
  len_mat     int,
  aut_ide_et  int,
  nom_ser     text,
  dep         text,
  prov        text,
  dist        text,
  fec_ing     date,
  ubi_viv     int,
  tip_viv     int,
  est_act     int
);

-- Índices útiles
create index if not exists idx_casos_anio  on public.casos_mensuales (anio, ubigeo);
create index if not exists idx_cem_anio    on public.cem_atenciones (anio);

-- Seguridad: solo usuarios autenticados (login) pueden LEER los datos
alter table public.casos_mensuales   enable row level security;
alter table public.cem_atenciones    enable row level security;
alter table public.fiscalia_casos    enable row level security;
alter table public.familias_atendidas enable row level security;

create policy "leer_autenticados" on public.casos_mensuales    for select to authenticated using (true);
create policy "leer_autenticados" on public.cem_atenciones     for select to authenticated using (true);
create policy "leer_autenticados" on public.fiscalia_casos     for select to authenticated using (true);
create policy "leer_autenticados" on public.familias_atendidas for select to authenticated using (true);

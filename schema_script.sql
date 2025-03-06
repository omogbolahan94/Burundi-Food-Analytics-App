-- set password for this database (this is needed for PostGIS import and export):
ALTER USER postgres PASSWORD 'postgres';

-- Move data from public schema into the burundi_data schema
ALTER TABLE public.bi_province SET SCHEMA burundi_data;
ALTER TABLE public.bi_commune SET SCHEMA burundi_data;
ALTER TABLE public.bi_markets SET SCHEMA burundi_data;
ALTER TABLE public.bi_settlements SET SCHEMA burundi_data;
ALTER TABLE public.bi_capital_areas SET SCHEMA burundi_data;
ALTER TABLE public.bi_country SET SCHEMA burundi_data;
ALTER TABLE public.bi_country_boundaries SET SCHEMA burundi_data;
ALTER TABLE public.bi_local_areas SET SCHEMA burundi_data;
ALTER TABLE public.bi_main_roads SET SCHEMA burundi_data;
ALTER TABLE public.bi_main_roads_vertices_gpr SET SCHEMA burundi_data;
ALTER TABLE public.bi_medium_areas SET SCHEMA burundi_data;
ALTER TABLE public.bi_protected_areas SET SCHEMA burundi_data;
ALTER TABLE public.bi_rivers SET SCHEMA burundi_data;
ALTER TABLE public.bi_small_areas SET SCHEMA burundi_data;
ALTER TABLE public.bi_water_bodies SET SCHEMA burundi_data;

-- Since spatial_ref_sys is already in public, allow burundi_data to use it:
GRANT SELECT ON public.spatial_ref_sys TO public;

-- to always load data to the burundi_schema instead of the public schema by default
SET search_path TO burundi_data;


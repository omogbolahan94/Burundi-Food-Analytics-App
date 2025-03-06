select * from burundi_data.bi_province;

select * from burundi_data.bi_commune;

/* To load a CSV file will load the bi_markets differently. We can import the CSV file by first 
creating a schema for the data then right click on the created table to import the SCV file unto it.
*/
CREATE TABLE burundi_data.bi_markets (
	id serial NOT NULL,
	name character varying(50),
	lat numeric,
	lon numeric
)
SELECT * FROM burundi_data.bi_markets;

-- Add a geom column to the markets data so that GIS software can detect it
ALTER TABLE burundi_data.bi_markets
ADD COLUMN geom  geometry(POINT 4326);

-- Now create a point geometry value from the exisiting latand lon column
UPDATE burundi_data.bi_markets
SET geom = ST_SetSRIT(ST_MakePoint(lat, lon), 4326));

SELECT * FROM burundi_data.bi_markets
ORDER BY gid ASC 

/****************** SPATIAL QUERY **********************/
-- distance between 2 settlements (Settlement with id 300 and 303)
SELECT * FROM burundi_data.bi_settlements;

SELECT ST_Distance(ST_TRANSFORM(settlement_a.geom, 32736), ST_Transform(settlement_b.geom, 32736)) Calculated_Distance
FROM burundi_data.bi_settlements as settlement_a, burundi_data.bi_settlements as settlement_b
WHERE settlement_a.gid= 300 and settlement_b.gid = 303


-- all settlements located in the commune of Rumonge that had more than 3000 inhabitants at that time.
SELECT settlements.gid, settlements.name, settlements.pop_2020, commune.name_com, commune.geom
FROM burundi_data.bi_settlements settlements
INNER JOIN burundi_data.bi_commune commune
ON settlements.id_com = commune.id_com
WHERE commune.name_com = 'Rumonge' ; -- AND settlements.pop_2020 > 3000;

-- solving the code above differently
SELECT settlements.gid, settlements.name, settlements.pop_2020, commune.name_com
FROM burundi_data.bi_settlements settlements, burundi_data.bi_commune commune
WHERE settlements.id_com = commune.id_com
	  AND commune.name_com = 'Rumonge' 
	  AND settlements.pop_2020 > 3000;
	  
	  
/* id, name and location of all medium markets that had less than 15000 inhabitants in 2020, 
that are located in provinces that had more than one million inhabitants at that time, 
including the name of the communes where they are located.*/
SELECT market.gid, market.name_com, market.geom    
FROM burundi_data.bi_markets market
LEFT JOIN burundi_data.bi_province province
ON market.id_prov = province.id_prov
LEFT JOIN burundi_data.bi_commune commune
ON market.id_com = commune.id_com
WHERE market.pop_2020 < 150000 AND province.pop_2020 < 1000000 ;
	  
/*
name and geometry of all the settlements in Burundi that are located 
within 20km of any terrestrial border.
*/
-- Projected CRS for the geom column is EPSG:4326 (WGS 84) (degrees), 
-- transform first to Projected CRS in meter, EPSG:3857
SELECT s.gid, s.name AS settlement_name, s.geom
FROM burundi_data.bi_settlements AS s
LEFT JOIN burundi_data.bi_main_roads AS t
ON ST_DWithin(
	s.geom, 
	t.geom,
    20000
);

SELECT * 
FROM burundi_data.bi_settlements terrestrial
LIMIT 5;


/*
write a query that would return the total density of the population in the 
capital (Bujumbura Mairie) and adjacent communes.
*/
SELECT * FROM burundi_data.bi_commune
SELECT * FROM burundi_data.bi_capital_areas
WHERE name = 'Bujumbura city market';


WITH bujumbura AS (
    -- Get the geometry of Bujumbura Mairie
    SELECT name, population/ST_Area(geom) AS bujumbura_density, geom
    FROM burundi_data.bi_capital_areas
    WHERE name = 'Bujumbura city market'
),
adjacent_communes AS (
    -- Find adjacent communes using ST_Touches (directly touching communes)
    SELECT b.name, b.bujumbura_density, c.name_com, c.pop_2020/ST_Area(c.geom) AS commune_density
    FROM burundi_data.bi_commune AS c
    JOIN bujumbura AS b
    ON ST_DWithin(
		c.geom, 
		b.geom) OR b.name = 'Bujumbura city market' -- Include Bujumbura Mairie itself
)
SELECT * FROM adjacent_communes;

/***************************** SPATIAL FUNCTION OF GEOM ******************************/
-- Get the spatial reference identification
SELECT ST_SRID(geom) reference_id
FROM burundi_data.bi_commune;

-- Compare 2 spatial geometry together: retrieve the communes that belong to the province Rumonge.
SELECT commune.name_com, province.geom
FROM burundi_data.bi_commune commune, burundi_data.bi_province province
WHERE ST_CONTAINS(province.geom, commune.geom) AND province.name_prov='Rumonge';
-- if I had use ST_WITHIN function to get the same spatial relationship, I would have reverse the argument
-- to mean that the commune is within the province,



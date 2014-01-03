-- This is where the custom views are installed. Right now, they're used
-- to simplify the user permissions logic, but there may be more down 
-- the line.

------------------------
-- View: v_private_audio
------------------------
CREATE OR REPLACE VIEW v_private_audio AS 
 SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id
   FROM (        (         SELECT m.entity_id AS id, g.name, a.user_id, a.authority_id
                           FROM site_genericassociation m, site_view g, site_userauthorityobject a
                          WHERE m.source_id = g.id AND g.id = a.object_id AND a.content_type_id = 24 AND m.source_type_id = 24 AND m.entity_type_id = 21
                UNION 
                         SELECT m.id, g.name, a.user_id, a.authority_id
                           FROM site_audio m, site_project g, site_userauthorityobject a
                          WHERE m.project_id = g.id AND g.id = a.object_id AND a.content_type_id = 23)
        UNION 
                 SELECT m.id, g.name, m.owner_id, 3 AS authority_id
                   FROM site_audio m, site_project g
                  WHERE m.project_id = g.id) v
  GROUP BY v.id, v.name, v.user_id;

--------------------------
-- View: v_private_markers
--------------------------
CREATE OR REPLACE VIEW v_private_markers AS 
 SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id
   FROM (        (         SELECT m.entity_id AS id, g.name, a.user_id, a.authority_id
                           FROM site_genericassociation m, site_view g, site_userauthorityobject a
                          WHERE m.source_id = g.id AND g.id = a.object_id AND a.content_type_id = 24 AND m.source_type_id = 24 AND m.entity_type_id = 10
                UNION 
                         SELECT m.id, g.name, a.user_id, a.authority_id
                           FROM site_marker m, site_project g, site_userauthorityobject a
                          WHERE m.project_id = g.id AND g.id = a.object_id AND a.content_type_id = 23)
        UNION 
                 SELECT m.id, g.name, m.owner_id, 3 AS authority_id
                   FROM site_marker m, site_project g
                  WHERE m.project_id = g.id) v
  GROUP BY v.id, v.name, v.user_id;

-------------------------
-- View: v_private_photos
-------------------------
CREATE OR REPLACE VIEW v_private_photos AS 
 SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id
   FROM (        (         SELECT m.entity_id AS id, g.name, a.user_id, a.authority_id
                           FROM site_genericassociation m, site_view g, site_userauthorityobject a
                          WHERE m.source_id = g.id AND g.id = a.object_id AND a.content_type_id = 24 AND m.source_type_id = 24 AND m.entity_type_id = 20
                UNION 
                         SELECT m.id, g.name, a.user_id, a.authority_id
                           FROM site_photo m, site_project g, site_userauthorityobject a
                          WHERE m.project_id = g.id AND g.id = a.object_id AND a.content_type_id = 23)
        UNION 
                 SELECT m.id, g.name, m.owner_id, 3 AS authority_id
                   FROM site_photo m, site_project g
                  WHERE m.project_id = g.id) v
  GROUP BY v.id, v.name, v.user_id;

---------------------------
-- View: v_private_projects
---------------------------

-- helper view to concatenate shared users:
CREATE OR REPLACE VIEW v_projects_shared_with AS 
 SELECT g.id, g.name, array_to_string(array_agg(u.username), ', '::text) AS shared_with
   FROM site_project g, site_userauthorityobject a, auth_user u
  WHERE g.id = a.object_id AND a.user_id = u.id AND a.content_type_id = 23
  GROUP BY g.id, g.name;
  
-- actual v_private_projects view:
CREATE OR REPLACE VIEW v_private_projects AS 
 SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id, s.shared_with
   FROM (         SELECT g.id, g.name, a.user_id, a.authority_id
                   FROM site_project g, site_userauthorityobject a
                  WHERE g.id = a.object_id AND a.content_type_id = 23
        UNION 
                 SELECT site_project.id, site_project.name, site_project.owner_id AS user_id, 3 AS authority_id
                   FROM site_project) v
   LEFT JOIN v_projects_shared_with s ON v.id = s.id
  GROUP BY v.id, v.name, v.user_id, s.shared_with;

------------------------
-- View: v_private_views
------------------------
CREATE OR REPLACE VIEW v_private_views AS 
SELECT v.id, v.name, v.user_id, max(v.authority_id) AS authority_id
FROM 
(
    SELECT g.id, g.name, a.user_id, a.authority_id
    FROM site_view g, site_userauthorityobject a
    WHERE g.id = a.object_id AND a.content_type_id = 24
  UNION 
    SELECT id, name, owner_id as user_id, 3 AS authority_id
    FROM site_view
) v
GROUP BY v.id, v.name, v.user_id;
  
------------------------
-- View: v_public_photos
------------------------
CREATE OR REPLACE VIEW v_public_photos AS 
 SELECT t.id, max(t.view_authority) AS view_authority, array_to_string(array_agg(t.access_key), ','::text) AS access_keys
   FROM (         SELECT a.entity_id AS id, v.view_authority, v.access_key
                   FROM site_genericassociation a, site_view v
                  WHERE a.source_id = v.id AND a.source_type_id = 24 AND a.entity_type_id = 20
        UNION 
                 SELECT p.id, pr.view_authority, pr.access_key
                   FROM site_photo p, site_project pr
                  WHERE p.project_id = pr.id) t
  WHERE t.view_authority > 1
  GROUP BY t.id;

-------------------------
-- View: v_public_audio
-------------------------
CREATE OR REPLACE VIEW v_public_audio AS
select t.id, max(t.view_authority) as view_authority, 
	array_to_string(array_agg(t.access_key), ',') as access_keys
from 
(
select a.entity_id as id, v.view_authority, v.access_key
from site_genericassociation a, site_view v
where 
  a.source_id = v.id and
  a.source_type_id = 24 and 
  a.entity_type_id = 21 
union
select a.id, pr.view_authority, pr.access_key
from site_audio a, site_project pr
 where a.project_id = pr.id
) t
where t.view_authority > 1
group by t.id;

-------------------------
-- View: v_public_markers
-------------------------
CREATE OR REPLACE VIEW v_public_markers AS
select t.id, max(t.view_authority) as view_authority, 
	array_to_string(array_agg(t.access_key), ',') as access_keys
from 
(
select a.entity_id as id, v.view_authority, v.access_key
from site_genericassociation a, site_view v
where 
  a.source_id = v.id and
  a.source_type_id = 24 and 
  a.entity_type_id = 10 
union
select m.id, pr.view_authority, pr.access_key
from site_marker m, site_project pr
 where m.project_id = pr.id
) t
where t.view_authority > 1
group by t.id;

-- This is where the custom views are installed. Right now, they're used
-- to simplify the user permissions logic, but there may be more down
-- the line.

--------------------------------------------------------------------------------------
-- Convenience Views
--------------------------------------------------------------------------------------
-- drop all views:
DROP VIEW IF EXISTS v_projects_shared_with cascade;
DROP VIEW IF EXISTS v_views_shared_with cascade;
DROP VIEW IF EXISTS v_form_fields cascade;
DROP VIEW IF EXISTS v_private_projects cascade;
DROP VIEW IF EXISTS v_private_presentations cascade;
DROP VIEW IF EXISTS v_private_forms cascade;
--DROP VIEW IF EXISTS v_private_layers cascade;
DROP VIEW IF EXISTS v_private_markers cascade;
DROP VIEW IF EXISTS v_private_marker_accessible_media cascade;
DROP VIEW IF EXISTS v_private_associated_media cascade;
DROP VIEW IF EXISTS v_private_audio cascade;
DROP VIEW IF EXISTS v_private_photos cascade;
DROP VIEW IF EXISTS v_private_mapimages cascade;
DROP VIEW IF EXISTS v_private_maps cascade;
DROP VIEW IF EXISTS v_private_videos cascade;
DROP VIEW IF EXISTS v_private_prints cascade;
DROP VIEW IF EXISTS v_public_photos cascade;
DROP VIEW IF EXISTS v_public_audio cascade;
DROP VIEW IF EXISTS v_public_markers cascade;


-- helper view to concatenate shared users:
CREATE OR REPLACE VIEW v_projects_shared_with AS
 SELECT g.id, g.name, array_to_string(array_agg(u.username), ', ') AS shared_with
   FROM site_project g, site_userauthorityobject a, auth_user u
  WHERE g.id = a.object_id AND a.user_id = u.id AND a.content_type_id = (select id from django_content_type where model = 'project')
  GROUP BY g.id, g.name;

-- helper view to concatenate form fields:
CREATE OR REPLACE VIEW v_form_fields as
 SELECT g.id, g.name, array_to_string(array_agg(f.col_alias), ', '::text) AS form_fields
   FROM site_form g, site_field f
  WHERE g.id = f.form_id
  GROUP BY g.id, g.name;


--------------------------------------------------------------------------------------
-- Security Views for Logged In Users
--------------------------------------------------------------------------------------

------------------------
-- v_private_projects --
------------------------
-- A view to show all of the projects, who can access
-- them, and at what security level (view, edit, or manage)
CREATE OR REPLACE VIEW v_private_projects AS
SELECT v.id as project_id, v.name, v.user_id, max(v.authority_id) AS authority_id
 FROM (
  (SELECT g.id, g.name, a.user_id, a.authority_id
  FROM site_project g, site_userauthorityobject a
  WHERE g.id = a.object_id AND a.content_type_id = (select id from django_content_type where model = 'project'))
    UNION
  (SELECT site_project.id, site_project.name, site_project.owner_id AS user_id, 3 AS authority_id
  FROM site_project)
) v
GROUP BY v.id, v.name, v.user_id;

---------------------
-- v_private_forms --
---------------------
-- A view to show all of the forms, who can access
-- them, and at what security level (view, edit, or manage)
CREATE OR REPLACE VIEW v_private_forms AS
SELECT v.id as form_id, v.name, v.user_id, max(v.authority_id) AS authority_id
 FROM (
  --users who have been given direct access to a form:
  SELECT g.id, g.name, a.user_id, a.authority_id
  FROM site_form g, site_userauthorityobject a
  WHERE g.id = a.object_id AND a.content_type_id = (select id from django_content_type where model = 'form')
    UNION
  --form owners:
  SELECT site_form.id, site_form.name, site_form.owner_id AS user_id, 3 AS authority_id
  FROM site_form
) v
GROUP BY v.id, v.name, v.user_id;

-----------------------
-- v_private_markers --
-----------------------
-- A view to show all of the markers, who can access
-- them, and at what security level (view, edit, or manage)
CREATE OR REPLACE VIEW v_private_markers AS
SELECT v.id as marker_id, v.user_id, max(v.authority_id) AS authority_id
FROM  (
    -- accessible via project permissions
    SELECT m.id, p.user_id, p.authority_id
    FROM site_marker m, v_private_projects p
    WHERE m.project_id = p.project_id
  UNION
    -- accessible because is marker owner
    SELECT m.id, m.owner_id, 3 AS authority_id
    FROM site_marker m
) v
GROUP BY v.id, v.user_id;

---------------------------------------
-- v_private_marker_accessible_media --
---------------------------------------
-- A view to show all of the media (form records, markers,
-- photos, audio, mapimages, and video) that has been made
-- accessible to a particular set of users based on the
-- accessibility of a parent marker (is read-only)
CREATE OR REPLACE VIEW v_private_marker_accessible_media AS
SELECT m.marker_id, t1.model as parent,
  a.entity_id as id, t2.model as child,
  m.user_id, 1 as authority_id
FROM site_genericassociation a, django_content_type t1,
  django_content_type t2, v_private_markers m
WHERE a.source_type_id = t1.id and t1.model = 'marker' and
  a.entity_type_id = t2.id and a.source_id = m.marker_id;

------------------------
-- View: v_private_audio
------------------------
CREATE OR REPLACE VIEW v_private_audio AS
SELECT v.id as audio_id, v.user_id, max(v.authority_id) AS authority_id
FROM  (
    -- accessible via project permissions
    SELECT m.id, p.user_id, p.authority_id
    FROM site_audio m, v_private_projects p
    WHERE m.project_id = p.project_id
  UNION
    -- accessible b/c user is audio owner
    SELECT m.id, m.owner_id, 3 AS authority_id
    FROM site_audio m, site_project g
    WHERE m.project_id = g.id) v
GROUP BY v.id, v.user_id;

-------------------------
-- View: v_private_photos
-------------------------
CREATE OR REPLACE VIEW v_private_photos AS
SELECT v.id as photo_id, v.user_id, max(v.authority_id) AS authority_id
FROM  (
    -- accessible via project permissions
    SELECT m.id, p.user_id, p.authority_id
    FROM site_photo m, v_private_projects p
    WHERE m.project_id = p.project_id
  UNION
    -- accessible b/c user is photo owner
    SELECT m.id, m.owner_id, 3 AS authority_id
    FROM site_photo m, site_project g
    WHERE m.project_id = g.id) v
GROUP BY v.id, v.user_id;

-------------------------
-- View: v_private_maps
-------------------------
CREATE OR REPLACE VIEW v_private_maps AS
SELECT v.id as map_id, v.user_id, max(v.authority_id) AS authority_id
FROM  (
    -- accessible via project permissions
    SELECT m.id, p.user_id, p.authority_id
    FROM site_styledmap m, v_private_projects p
    WHERE m.project_id = p.project_id
  UNION
    -- accessible b/c user is photo owner
    SELECT m.id, m.owner_id, 3 AS authority_id
    FROM site_styledmap m, site_project g
    WHERE m.project_id = g.id) v
GROUP BY v.id, v.user_id;

------------------------
-- View: v_private_mapimages
------------------------
CREATE OR REPLACE VIEW v_private_mapimages AS
SELECT v.id as mapimage_id, v.user_id, max(v.authority_id) AS authority_id
FROM  (
    -- accessible via project permissions
    SELECT m.id, p.user_id, p.authority_id
    FROM site_mapimage m, v_private_projects p
    WHERE m.project_id = p.project_id
  UNION
    -- accessible b/c user is mapimage owner
    SELECT m.id, m.owner_id, 3 AS authority_id
    FROM site_mapimage m, site_project g
    WHERE m.project_id = g.id) v
GROUP BY v.id, v.user_id;

-------------------------
-- View: v_private_videos
-------------------------
CREATE OR REPLACE VIEW v_private_videos AS
SELECT v.id as video_id, v.user_id, max(v.authority_id) AS authority_id
FROM  (
    -- accessible via project permissions
    SELECT m.id, p.user_id, p.authority_id
    FROM site_video m, v_private_projects p
    WHERE m.project_id = p.project_id
  UNION
    -- accessible b/c user is mapimage owner
    SELECT m.id, m.owner_id, 3 AS authority_id
    FROM site_video m, site_project g
    WHERE m.project_id = g.id) v
GROUP BY v.id, v.user_id;

-------------------------
-- View: v_private_prints
-------------------------
CREATE OR REPLACE VIEW v_private_prints AS
SELECT v.id as print_id, v.user_id, max(v.authority_id) AS authority_id
FROM  (
    -- accessible via project permissions
    SELECT m.id, p.user_id, p.authority_id
    FROM site_print m, v_private_projects p
    WHERE m.project_id = p.project_id
  UNION
    -- accessible b/c user is print owner
    SELECT m.id, m.owner_id, 3 AS authority_id
    FROM site_print m
) v
GROUP BY v.id, v.user_id;

--------------------------------------------------------------------------------------
-- Public Views for Anonymous Users (Still need to implement and verify)
--------------------------------------------------------------------------------------

------------------------
-- View: v_public_photos
------------------------
CREATE OR REPLACE VIEW v_public_photos AS
 SELECT t.id as photo_id, max(t.view_authority) AS view_authority, array_to_string(array_agg(t.access_key), ','::text) AS access_keys
   FROM (
                 SELECT p.id, pr.view_authority, pr.access_key
                   FROM site_photo p, site_project pr
                  WHERE p.project_id = pr.id) t
  WHERE t.view_authority > 1
  GROUP BY t.id;

-------------------------
-- View: v_public_audio
-------------------------
CREATE OR REPLACE VIEW v_public_audio AS
select t.id as audio_id, max(t.view_authority) as view_authority,
	array_to_string(array_agg(t.access_key), ',') as access_keys
from
(
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
select t.id as marker_id, max(t.view_authority) as view_authority,
	array_to_string(array_agg(t.access_key), ',') as access_keys
from
(
select m.id, pr.view_authority, pr.access_key
from site_marker m, site_project pr
 where m.project_id = pr.id
) t
where t.view_authority > 1
group by t.id;











---------------------
-- Reset Sequences --
---------------------
BEGIN;
SELECT setval(pg_get_serial_sequence('"site_layer"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_layer";
SELECT setval(pg_get_serial_sequence('"site_statuscode"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_statuscode";
SELECT setval(pg_get_serial_sequence('"site_uploadsource"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_uploadsource";
SELECT setval(pg_get_serial_sequence('"site_uploadtype"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_uploadtype";
SELECT setval(pg_get_serial_sequence('"site_errorcode"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_errorcode";
SELECT setval(pg_get_serial_sequence('"site_marker"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_marker";
SELECT setval(pg_get_serial_sequence('"site_overlaysource"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_overlaysource";
SELECT setval(pg_get_serial_sequence('"site_overlaytype"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_overlaytype";
SELECT setval(pg_get_serial_sequence('"site_tileset"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_tileset";
SELECT setval(pg_get_serial_sequence('"site_objectauthority"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_objectauthority";
SELECT setval(pg_get_serial_sequence('"site_userauthority"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_userauthority";
SELECT setval(pg_get_serial_sequence('"site_userauthorityobject"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_userauthorityobject";
SELECT setval(pg_get_serial_sequence('"site_project"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_project";
SELECT setval(pg_get_serial_sequence('"site_userprofile_contacts"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_userprofile_contacts";
SELECT setval(pg_get_serial_sequence('"site_userprofile"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_userprofile";
SELECT setval(pg_get_serial_sequence('"site_genericassociation"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_genericassociation";
SELECT setval(pg_get_serial_sequence('"site_datatype"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_datatype";
SELECT setval(pg_get_serial_sequence('"site_field"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_field";
SELECT setval(pg_get_serial_sequence('"site_form"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_form";
SELECT setval(pg_get_serial_sequence('"site_layout"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_layout";
SELECT setval(pg_get_serial_sequence('"site_print"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_print";
SELECT setval(pg_get_serial_sequence('"site_mapimage"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_mapimage";
SELECT setval(pg_get_serial_sequence('"site_imageopts"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_imageopts";
SELECT setval(pg_get_serial_sequence('"site_photo"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_photo";
SELECT setval(pg_get_serial_sequence('"site_audio"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_audio";
SELECT setval(pg_get_serial_sequence('"site_video"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_video";
SELECT setval(pg_get_serial_sequence('"site_styledmap"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_styledmap";
COMMIT;

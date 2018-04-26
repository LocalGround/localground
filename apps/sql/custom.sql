--------------------------------------------------------------------------------
-- Legacy Cleanup
--------------------------------------------------------------------------------
DROP VIEW IF EXISTS v_projects_shared_with cascade;
DROP VIEW IF EXISTS v_views_shared_with cascade;
DROP VIEW IF EXISTS v_form_fields cascade;
DROP VIEW IF EXISTS v_private_projects cascade;
DROP VIEW IF EXISTS v_private_presentations cascade;
DROP VIEW IF EXISTS v_private_forms cascade;
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

--------------------------------------------------------------------------------
-- Security Views for Logged In Users
--------------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_projects_shared_with AS
 SELECT g.id, g.name, array_to_string(array_agg(u.username), ', ') AS shared_with
   FROM site_project g, site_userauthorityobject a, auth_user u
  WHERE g.id = a.object_id AND a.user_id = u.id AND a.content_type_id = (select id from django_content_type where model = 'project')
  GROUP BY g.id, g.name;

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

--------------------------------------------------------------------------------
-- Reset Sequences
--------------------------------------------------------------------------------
BEGIN;
SELECT setval(pg_get_serial_sequence('"site_layer"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_layer";
SELECT setval(pg_get_serial_sequence('"site_statuscode"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_statuscode";
SELECT setval(pg_get_serial_sequence('"site_uploadsource"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_uploadsource";
SELECT setval(pg_get_serial_sequence('"site_uploadtype"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_uploadtype";
SELECT setval(pg_get_serial_sequence('"site_errorcode"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_errorcode";
--SELECT setval(pg_get_serial_sequence('"site_marker"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_marker";
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
SELECT setval(pg_get_serial_sequence('"site_dataset"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_dataset";
SELECT setval(pg_get_serial_sequence('"site_layout"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_layout";
SELECT setval(pg_get_serial_sequence('"site_print"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_print";
SELECT setval(pg_get_serial_sequence('"site_mapimage"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_mapimage";
SELECT setval(pg_get_serial_sequence('"site_imageopts"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_imageopts";
SELECT setval(pg_get_serial_sequence('"site_photo"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_photo";
SELECT setval(pg_get_serial_sequence('"site_audio"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_audio";
SELECT setval(pg_get_serial_sequence('"site_video"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_video";
SELECT setval(pg_get_serial_sequence('"site_styledmap"','id'), coalesce(max("id"), 1), max("id") IS NOT null) FROM "site_styledmap";
COMMIT;

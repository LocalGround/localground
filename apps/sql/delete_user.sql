-- Note: this will not handle the amazon media. 
-- This is best done through the manage.py shell interface
select id, username from auth_user where username = 'vw';
delete from site_genericassociation where owner_id = 1;
delete from site_photo where owner_id = 1;
delete from site_audio where owner_id = 1;
delete from site_video where owner_id = 1;
delete from site_userprofile where user_id = 1;
delete from site_layer where owner_id = 1;
delete from site_styledmap where owner_id = 1;
delete from site_record where owner_id = 1;
delete from site_field where owner_id = 1;
delete from site_dataset where owner_id = 1;
delete from site_project where owner_id = 1;
delete from site_print where owner_id = 1;
delete from auth_user where id = 1;

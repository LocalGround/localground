# Preface / Note to Contributors
The code came about from a series of research projects, and was built quickly in reponse to changing use cases and for experimentation.  The following is an explanation of the current code organization, but has no bearing on how the code actually ought to be organized.  It's just a starting off point.  As you read through the structure, please think about how things might be refactored and simplified.  Please note that this code is not yet stable, and there are an number of open bugs which need to be completed before the beta release.

# Bug Tracker
This project has a bug tracker which is currently being updated / maintained at http://bugzilla.localground.org.  We may eventually migrate this to the GitHub-hosted bug tracker. 

# Code Overview
## account
Contains code for managing user preferences and user-generated data groupings (currently views and projects).
### account/models
* ``Base``: Abstract base class for media files (for common core elements)
* ``BasePermissions``:  Abstract base class for media groups (Project and View objects).  
* ``Group``: Abstract class that extends BasePermissions; provides helper methods to determine whether a user has read/write/manage permissions on an object.
* ``Project``: Default grouping for user-generated content.  Every media type must be associated with one and only one project.  Think of a project as a folder where users can file their media.  Has helper functions for retrieving all media associated with a particular project (for the JavaScript API).
* ``View``:   A user-generated grouping of media.  Media associations are specified in the EntityGroupAssociation Model.  Only partially implemented.
* ``Scene``: Not used anywhere yet, but a stub for the new storytelling interface (where each view could be a collection of ordered scenes, configured by the user).
* ``ObjectAuthority``:  Describes the permissions configuration of any class inheriting from BasePermissions (either private, public-with-key, or public).
* ``UserAuthority``:  Used in conjunction with ObjectAuthority to assign user-level permissions (special cases) which are beyond the group's baseline permissions.  There are 3 user-level permissions statuses:  "can view," "can edit," and "can manage."
* ``UserAuthorityObject``:  Model that assigns a particular User (auth_user) and UserAuthority object to a particular Group.
* ``EntityGroupAssociation``: Uses the contenttypes framework to create one big "meta-association table" between media elements (photos, audio files, scans, etc.) and groups.  See the reference below for more information about the contenttypes framework.<br>
http://weispeaks.wordpress.com/2009/11/04/overcoming-limitations-in-django-using-generic-foreign-keys/

### account/views
* ``api.py``:  Contains views for retrieving ``account`` model objects as serialized JSON strings (based on some input query parameters).  Even though these views are defined in the ``account`` app, the url configuration file that refers to these views is located in the ``api`` app.  This needs to be revisited.
   * ``get_group``: Public view that returns serialized json for a particular Project or View.
   * ``get_my_projects``:  Public view that returns serialized json for all the projects to which a user belongs.  Even though this is being referenced in ``api/urls/api_urls.py``, it's not actively being used.
   * ``get_users_from_username_string``:  Used for autocomplete when a user is looking for other users on the system to add to a Group.
* ``generic.py``:  Contains views for updating one's user profile (default contacts, default map extent, etc.)
   * ``change_user_profile``: works in conjunction with CustomUserChangeForm, UserProfileForm to allow user to modify his/her preferences.
   * ``send_invitation``: Intended to be used to allow users to invite new users to Local Ground.  Not currently being used -- needs to be re-integrated with the "Share" functionality (when assigning users to groups)
   * ``get_my_contacts_autocomplete``:  Autocomplete for user's contacts (plaintext version).
   * ``get_contacts_autocomplete``:  Autocomplete for Local Ground users (plaintext version).  Todo:  consolidate with ``api.py/get_users_from_username_string``.
* ``groups.py``:  Contains views for creating, editing and updating permissions for View and Project objects.
   * ``create_update_project``:  This view works in conjunction with the Group forms to create and update permissions for views and projects.  It also processes a UserAuthorityObject formset, which applies user-level permissions to a particular project.  This form uses the contenttypes framework (so object-user permissions can be arbitrarily assigned to more than one object).
   * ``show_group_list``:  The landing page in the "profile" section of Local Ground, where the user gets to view the projects/views to which s/he is authorized.
   * ``_batch_update``:  private method that allows users to batch-update the names and descriptions of their views / projects.  Needs to be re-written to use inline formsets (for better error handling / readability).
   * ``delete_groups``:  View that permanently deletes a group and all of the media associated with it (in the database and on the file system).  Really needs to be thought through a lot more.
* ``mediaserver.py``:  Contains views that obscure media server file path references.
   * ``serve_media``:  Uses Apache's libapache2-mod-xsendfile module to read a base64 encoded relative media path and serve out the corresponding media file.  More discussion needed on the best way to serve secure static media without the overhead of repetitive database queries.
   
### account/forms
Forms used to update (1) Project and View models (and corresponding permissions), (2) UserAuthorityObjects, and (3) UserProfiles.

### account/managers.py
Used to apply functionality to model queries.  For this app, managers.py is used to chain dictionary conversion to the end of a query and to get additional aggregation (counts).

## api
Not truly an application -- just a place to store 2 url configuration files:  api_urls.py and tester_urls.py.  Note:  many of the API functions aren't really used in the latest configuration of Local Ground.  Todo:  go through each of these URLs and fix / purge deprecated code / views.
* ``api_urls.py``:  A bunch of url mappings to views in other apps that return serialize JSON in response to user-generated queries.
* ``tester_urls.py``: A bunch of urls mappings that merge with api_tester.html, giving users instructions as to how the API should be used.

## ebays
Not a full application.  Has custom functionality for supporting the EBAYS (East Bay Young Scientists) Summer 2012 program for analyzing air quality data.  Not sure how to handle code which is somewhat external to the core functionality of Local Ground.

## jobs
Place to store code for cronjobs / scheduled tasks.  Ideally, this section will be replaced by some sort of asynchronous tasking framework (celery + RabbitMQ?) where tasks can be fired on-demand.
* ``load_air_quality_data.py``:  Helper file for zipping sensor data & GPS data together for easy loading into Local Ground.  EBAYS-specific, but could easily be incorporated into the upload tool with some updates to the UI.
* ``process-maps.py``:  Script called by ``process-maps.sh`` that checks the scans table for new maps / attachments that need to be processed.  If there are new maps, this script fires the image processing script.
* ``process-maps.sh``:  Wrapper around process-maps.py so that it can work as a scheduled cronjob.  Currently, cron wakes up and fires this shell script every minute.

## lib
### lib/api/decorators.py
Contains decorator functions that the data API uses
* ``process_identity``:  Needs to be deprecated.  We have a middleware function that does what this intended to do.
* ``process_project``:  Selects a default project, based on a combination of explicit and implicit parameters (cookies, request parameters, last project created, etc.).

### lib/widgets/__init__.py
Most of the custom form widgets are defined here:
* ``TagAutocomplete`` for tagging  Todo:  filter tags by user context.
* ``SnippetWidget`` for digitizing tabular data.
* ``PointWidget``: GUI for specifying lat/lng
* ``PointWidgetHidden``: Hidden field for specifying lat/lng
* ``CustomCheckboxSelectMultiple`` for multi-select when you don't want every option in the database to be made available.
* ``CustomDateTimeWidget`` for picking date and time of day (a little clunky...could use some improvement).

### lib/widgets/permissions.py
UserAutocomplete custom form widget defined here.  Unclear why this is broken up into a separate file...

### lib/decorators.py
More decorators -- should probably be consolidated with those in lib/api/decorators.py
* ``get_group_if_authorized``:  Ensures that a project / view is only accessible if the user has permissions.
* ``_render_exception``: private helper function (for the decorators) that returns an exception in format appropriate for request type (html v. json)

### lib/emailer.py
Defines Emailer class that invites new users to Local Ground.  Not sure if this is currently being used, but called in ``account/generic.py/send_invitation``.

### lib/generic.py
* ``FastPaginator class`` overrides default Django paginator class and needed in cases where there are hundreds of thousands of Model records.  Why?  Because the default paginator queries the entire table in order to get a record count, which leads to extremely poor performance.
* ``prep_paginator``:  Adds necessary paging variables to the template context.
* ``generateID``:  generates 8-character unique ids for the Scans and Print models

### lib/models.py
Kind of a random smattering of helper classes.  These probably all need to be consolidated with the models in accounts/models.
* ``ReturnCode``:  Not really sure if this is used.
* ``ReturnCodes``:  A look-up table of return codes for various operations on media models.  Probably a better way to do this.
* ``ObjectTypes``:  A look-up table of supported media models (and their string representations).  Not sure how useful this class really is.
* ``BaseObject``:  abstract class for most media Models.  Needs to be consolidated with account/models/Base class.  We need a single base class abstraction (not two)!
* ``PointObject``: abstract class for uploads with lat/lng references.

### lib/reports.py
Defines ``Report``, a helper class that creates PDF files using ReportLab.

### lib/static_maps.py
Defines 2 helper classes -- ``OutputFormat`` and ``StaticMap`` -- that help create a static map (by either pulling from Google or CloudMade) and pasting user-drawn annotations on top (reprojected).  Todo:  add ability to include points, lines, and polygons on these maps too.

### lib/units.py
Defines ``Units``, a helper class for various unit conversions.

## mapserver
Directory to store MapServer configuration files (*.map files).  Haven't included Local Ground's on GitHub because there's DB connection info currently stored in them.  

## middleware
Stores middleware
### middleware/impersonate.py
For debugging only:  allows admins to view others' data configurations.

## overlays
Tiles and markers are really the only two objects handled in the overlays app.  Todo:  consolidate overlays app with uploads app (or potentially consolidate account, overlays, prints, uploads, and viewer into a single app).  
### overlays/models.py
* ``Marker``:  Markers are association objects with a lat/lng.  Markers can be associated with one or more photos, audio files, data records, etc.  This object needs to be re-factored to inherit from account/Group Model, since it's an association of other media objects (and should behave like a project or a view).  
* ``OverlaySource``:  Stores the source of the overlay (Cloudmade, Google, Stamen, locally produced, etc.)
* ``OverlayType``:  Stores the kind of overlay (Base tileset versus data overlay)
* ``WMSOverlay``:  Stores the specific overlays available in Local Ground.

### overlays/views.py
Views that allow user to create, update, delete, and view Markers.

### overlays/managers.py
Useful queries for batch Marker and WMSOverlay queries.

## prints
Code pertaining to generating paper-based maps and forms.

### prints/dynamic/dynamic_form.py
Defines ``DynamicFormBuilder``, a class that builds a dynamic Django form based on the table model spec.

### prints/dynamic/dynamic_model.py
Defines ``ModelClassBuilder``, a class that creates the DDL SQL for a user-generated table, created from the form wizard.

### prints/views
* ``api.py``
* ``create_form.py``
* ``create_print.py``
* ``tables.py``

### prints/models.py

### prints/managers.py

## registration
Modified from django-registration

## site_media
Where JavaScript, CSS, and Images are stored.  The JavaScript needs a thorough explanation, but will do this soon.

## static
Where static media (photos, prints, map images, attachments, audio files, etc. are stored)

## templates
Where templates are stored

## templatetags
Where template tags are stored

## uploads
Where all user-generated media is stored and processed; where image processing scripts are stored.  There's a lot of deprecated code in this directory.  Will go through it this week.

## viewer
















## context_processors.py
``context_processors.py/persistant_queries``:  Intercepts HttpRequests in order to add relevant data to the template context (mostly used for accessing global settings variables).  Also, for any of the map requests (/print/', '/maps/', '/ebays/', '/viewer/', '/scans/update-record/), this function also adds information about which tilesets which are available to the interactive map.






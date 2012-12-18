# To Generate These Fixtures:

python manage.py dumpdata account.ObjectAuthority >> fixtures/initial_data.json
python manage.py dumpdata account.UserAuthority >> fixtures/initial_data.json
python manage.py dumpdata prints.Layout >> fixtures/initial_data.json
python manage.py dumpdata prints.DataType >> fixtures/initial_data.json
python manage.py dumpdata overlays.OverlaySource >> fixtures/initial_data.json
python manage.py dumpdata overlays.OverlayType >> fixtures/initial_data.json
python manage.py dumpdata overlays.WMSOverlay >> fixtures/initial_data.json
python manage.py dumpdata uploads.StatusCode >> fixtures/initial_data.json
python manage.py dumpdata uploads.UploadSource >> fixtures/initial_data.json
python manage.py dumpdata uploads.UploadType >> fixtures/initial_data.json
python manage.py dumpdata uploads.ErrorCode >> fixtures/initial_data.json

Afterwards, edit initial_data so that there are commas between each fixture and
only 1 set of brackets.



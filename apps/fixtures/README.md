# To Generate These Fixtures:

python manage.py dumpdata site.ObjectAuthority >> fixtures/initial_data.json
python manage.py dumpdata site.UserAuthority >> fixtures/initial_data.json
python manage.py dumpdata site.Layout >> fixtures/initial_data.json
python manage.py dumpdata site.DataType >> fixtures/initial_data.json
python manage.py dumpdata site.OverlaySource >> fixtures/initial_data.json
python manage.py dumpdata site.OverlayType >> fixtures/initial_data.json
python manage.py dumpdata site.TileSet >> fixtures/initial_data.json
python manage.py dumpdata site.StatusCode >> fixtures/initial_data.json
python manage.py dumpdata site.UploadSource >> fixtures/initial_data.json
python manage.py dumpdata site.UploadType >> fixtures/initial_data.json
python manage.py dumpdata site.ErrorCode >> fixtures/initial_data.json

Afterwards, edit initial_data so that there are commas between each fixture and
only 1 set of brackets.



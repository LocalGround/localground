from localground.apps.site import models
from localground.apps.site.tests.models.abstract_base_uploaded_media_tests \
    import BaseUploadedMediaAbstractModelClassTest


class ProjectModelTest(object):

    def setUp(self):
        BaseUploadedMediaAbstractModelClassTest.setUp(self)

    def tearDown(self):
        # delete method also removes files from file system:
        for audio in models.Audio.objects.all():
            audio.delete()

    def test_dummy_audio(self, **kwargs):
        self.assertEqual(1, 1)

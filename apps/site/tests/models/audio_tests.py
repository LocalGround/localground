from localground.apps.site import models
from localground.apps.site.tests.models.abstract_base_uploaded_media_tests import \
    BaseUploadedMediaAbstractModelClassTest


class AudioModelTest(BaseUploadedMediaAbstractModelClassTest):

    def setUp(self):
        BaseUploadedMediaAbstractModelClassTest.setUp(self)
        self.model = self.create_audio()

    def tearDown(self):
        # delete method also removes files from file system:
        for audio in models.Audio.objects.all():
            audio.delete()

    def test_dummy_audio(self, **kwargs):
        self.assertEqual(1, 1)

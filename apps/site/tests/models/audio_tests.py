from localground.apps.site import models
from localground.apps.site.tests.models.abstract_base_uploaded_media_tests \
    import BaseUploadedMediaAbstractModelClassTest
from localground.apps.lib.helpers import upload_helpers
from django import test
import os

class AudioModelTest(BaseUploadedMediaAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseUploadedMediaAbstractModelClassTest.setUp(self)
        self.model = self.create_audio()

    def tearDown(self):
        # delete method also removes files from file system:
        for audio in models.Audio.objects.all():
            audio.remove_media_from_file_system()

    def test_create_audio_using_post(self, **kwargs):
        import tempfile
        import wave
        import random
        import struct
        from django.core.files import File
        
        # Create dummy audio file:
        tmp_file = tempfile.NamedTemporaryFile(suffix='.wav')
        noise_output = wave.open(tmp_file, 'w')
        noise_output.setparams((2, 2, 44100, 0, 'NONE', 'not compressed'))
        values = []
        SAMPLE_LEN = 44100 * 5

        for i in range(0, SAMPLE_LEN):
            value = random.randint(-32767, 32767)
            packed_value = struct.pack('h', value)
            values.append(packed_value)
            values.append(packed_value)

        value_str = ''.join(values)
        noise_output.writeframes(value_str)
        noise_output.close()

        # Save dummy file to disk:
        file_name_new = None
        with open(tmp_file.name, 'rb') as data:
            file_name_new = upload_helpers.save_file_to_disk(
                self.user, 'audio', File(data)
            )
            self.assertEqual(1,1)

            # Convert file to MP3
            media_path = upload_helpers.generate_absolute_path(
                self.user, 'audio'
            )
            with open(media_path + file_name_new, 'rb') as data:                                
                models.Audio.process_file(File(data), self.user)
                print(data.name)
                self.assertTrue(os.path.isfile(data.name))
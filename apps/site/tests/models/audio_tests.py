from localground.apps.site import models
from localground.apps.site.models import Audio
from localground.apps.site.managers import AudioManager
from localground.apps.site.tests.models.abstract_base_uploaded_media_tests \
    import BaseUploadedMediaAbstractModelClassTest
from localground.apps.site.tests.models import ExtrasMixinTest, PointMixinTest
from localground.apps.lib.helpers import upload_helpers
from django import test
import os


class AudioModelTest(ExtrasMixinTest, PointMixinTest,
                     BaseUploadedMediaAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseUploadedMediaAbstractModelClassTest.setUp(self)
        self.model = self.create_audio()
        self.object_type = self.model_name = self.pretty_name = 'audio'
        self.model_name_plural = self.pretty_name_plural = 'audio'

    def tearDown(self):
        # delete method also removes files from file system:
        for audio in models.Audio.objects.all():
            audio.remove_media_from_s3()

    def test_check_audio_objects_manager(self):
        self.assertTrue(hasattr(Audio, 'objects'))
        self.assertTrue(isinstance(Audio.objects, AudioManager))

    def makeTmpFile(self):
        import tempfile
        import wave
        import random
        import struct

        # Create dummy audio file:
        #tmp_file = tempfile.NamedTemporaryFile(suffix='.wav')
        tmp_file = open('/tmp/test.wav', 'w')
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
        print os.path.getsize('/tmp/test.wav')
        return tmp_file

    def test_convert_wav_to_mp3(self, **kwargs):
        from django.core.files import File
        tmp_file = self.makeTmpFile()
        with open(tmp_file.name, 'rb') as data:
            print data
            result = models.Audio.process_file(File(data), self.user)
            name_wav = tmp_file.name.split('/')[-1].lower()
            name_mp3 = name_wav.replace('wav', 'mp3')
            virtual_path = upload_helpers.generate_relative_path(self.user, 'audio')
            absolute_path = upload_helpers.generate_absolute_path(self.user, 'audio')
            wav_file_path = absolute_path + name_wav
            mp3_file_path = absolute_path + result['file_name_new']

            self.assertEqual(result['file_name_new'], name_mp3)
            self.assertEqual(result['content_type'], 'wav')
            self.assertEqual(result['file_name_orig'], tmp_file.name)
            self.assertEqual(result['name'], tmp_file.name)
            self.assertEqual(result['virtual_path'], virtual_path)

            # Test that both the mp3 and the wav file are now on disk
            self.assertTrue(os.path.isfile(wav_file_path))
            self.assertTrue(os.path.isfile(mp3_file_path))

    def test_delete(self, **kwargs):
        from django.core.files import File
        tmp_file = self.makeTmpFile()
        f = File(open('/tmp/test.wav'))
        self.model.process_file(f, self.user)

        # check that files are on the disk
        self.assertEqual(self.model.media_file, 'test.mp3')

        base_name, ext = os.path.splitext(self.model.media_file_orig.name)
        self.assertEqual('.wav', ext)

        self.model.delete()

        self.assertTrue(self.model.id is None)
        self.assertTrue(not hasattr(self.model.media_file_orig, 'url'))
        self.assertTrue(not hasattr(self.model.media_file, 'url'))



    def test_unicode_(self):
        test_string1 = str(self.model.id) + ': ' + self.model.name
        self.assertEqual(self.model.__unicode__(), test_string1)

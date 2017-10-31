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
        return tmp_file

        
       

    def test_convert_wav_to_mp3(self, **kwargs):
        from django.core.files import File
        tmp_file = self.makeTmpFile()
        with open(tmp_file.name, 'rb') as data:                            
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
        with open(tmp_file.name, 'rb') as data:                            
            result = models.Audio.process_file(File(data), self.user)
            name_wav = tmp_file.name.split('/')[-1].lower()
            name_mp3 = name_wav.replace('wav', 'mp3')
            virtual_path = upload_helpers.generate_relative_path(self.user, 'audio')
            absolute_path = upload_helpers.generate_absolute_path(self.user, 'audio')
            wav_file_path = absolute_path + name_wav
            mp3_file_path = absolute_path + result['file_name_new']

            self.model.file_name_new = result['file_name_new']
            self.model.content_type = result['content_type']

            # removing '/tmp' from file_name_orig. 
            # otherwise method will try to delete invalid path 
            # '/userdata/media/tester/audio//tmp/tmpExNqHF.wav'
            self.model.file_name_orig = name_wav
            self.model.name = result['name']
            self.model.virtual_path = result['virtual_path']
            self.model.save()

            # check that files are on the disk

            # Test that both the mp3 and the wav file are now on disk
            self.assertTrue(os.path.isfile(wav_file_path))
            self.assertTrue(os.path.isfile(mp3_file_path))

            self.model.delete()

            self.assertTrue(self.model.id is None)

            # Test that both the mp3 and the wav file are no longer on disk
            self.assertFalse(os.path.isfile(mp3_file_path))
            self.assertFalse(os.path.isfile(wav_file_path))
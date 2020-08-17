from localground.apps.site import models
from localground.apps.site.models import Audio
from localground.apps.site.managers import AudioManager
from localground.apps.site.tests.models.abstract_base_uploaded_media_tests \
    import BaseUploadedMediaAbstractModelClassTest
from localground.apps.site.tests.models import ExtrasMixinTest, PointMixinTest
from localground.apps.lib.helpers import upload_helpers
from django import test
import os
from django.core.files import File
import http.client
from urllib.parse import urlparse


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
        import wave
        import random
        import struct

        # Create dummy audio file:
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
        f = File(open('/tmp/test.wav'))
        self.model.process_file(f)

        self.assertNotEqual(self.model.media_file_orig.name.find('test'), -1)
        self.assertNotEqual(self.model.media_file_orig.name.find('.wav'), -1)
        self.assertNotEqual(self.model.media_file.name.find('test'), -1)
        self.assertNotEqual(self.model.media_file.name.find('.mp3'), -1)
        self.assertEqual(self.model.content_type, 'wav')

        # ensure that files are on Amazon S3
        urls = [self.model.media_file_orig.url, self.model.media_file.url]
        for url in urls:
            p = urlparse(url)
            conn = http.client.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 200)

    def test_delete(self, **kwargs):
        tmp_file = self.makeTmpFile()
        f = File(open('/tmp/test.wav'))
        self.model.process_file(f)

        # check that files are on the disk
        self.assertEqual(self.model.media_file.name, self.model.file_name_new)

        base_name, ext = os.path.splitext(self.model.media_file_orig.name)
        self.assertEqual('.wav', ext)

        urls = [self.model.media_file_orig.url, self.model.media_file.url]

        for url in urls:
            p = urlparse(url)
            conn = http.client.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 200)

        # Delete Audio model and associated S3 media images:
        self.model.delete()

        self.assertTrue(self.model.id is None)
        for url in urls:
            p = urlparse(url)
            conn = http.client.HTTPConnection(p.netloc)
            conn.request('HEAD', p.path)
            self.assertEqual(conn.getresponse().status, 403)

    def test_unicode_(self):
        self.assertEqual(
            self.model.__unicode__(),
            '{0}: {1}'.format(self.model.id, self.model.name)
        )

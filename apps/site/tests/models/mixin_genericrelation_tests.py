from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models
from localground.apps.site.models import GenericRelationMixin, \
    GenericAssociation, Audio, Photo


class GenericRelationMixinTest(ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_generic_relation_properties(self):
        from django.contrib.gis.db import models
        from django.contrib.contenttypes import fields
        for prop in [
            ('entities', fields.GenericRelation)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = GenericRelationMixin._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)


    def test_gen_rel_stash_and_grab(self):

        marker = self.create_marker()

        # check that marker has no associations yet
        self.assertEqual(len(marker.entities.all()), 0)

        # create and add photo to marker
        photo = self.create_photo()
        marker.stash(photo, self.user, 1)

        self.assertEqual(len(marker.entities.all()), 1)
        self.assertEqual(
            marker.entities.all()[0].entity_type, photo.get_content_type()
        )
        self.assertEqual(marker.entities.all()[0].entity_id, photo.id)

        # create and add audio to marker
        audio = self.create_audio()
        print(audio)
        marker.stash(audio, self.user, 1)

        self.assertEqual(len(marker.entities.all()), 2)
        self.assertEqual(
            marker.entities.all()[1].entity_type, audio.get_content_type()
        )
        self.assertEqual(marker.entities.all()[1].entity_id, audio.id)

        # create and add another audio to marker
        audio2 = self.create_audio()
        marker.stash(audio2, self.user, 1)
        print(marker.grab(Audio))
        print(marker.grab(Audio)[0].file_name_orig)
        print(marker.grab(Audio)[1].file_name_orig)

        # test grab()
        self.assertEqual(len(marker.grab(Audio)), 2)
        self.assertEqual(len(marker.grab(Photo)), 1)

        self.assertEqual(
            marker.grab(Photo)[0].name, 'Photo Name'
        )
        self.assertEqual(
            marker.grab(Photo)[0].file_name_orig, 'myphoto.jpg'
        )

        self.assertEqual(
            marker.grab(Audio)[0].name, 'Audio Name'
        )
        self.assertEqual(
            marker.grab(Audio)[0].file_name_orig, 'my_audio.wav'
        )

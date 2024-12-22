import factory

from backend.audioapp.models import AudioFile


class AudioFileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = AudioFile

    name = "test.wav"
    file = factory.django.FileField(filename="test.wav")

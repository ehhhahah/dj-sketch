import factory

from audioapp.models import AudioFile


class AudioFileFactory(factory.django.DjangoModelFactory):
    class Meta:  # type: ignore
        model = AudioFile

    title = "test.wav"
    file = factory.django.FileField(filename="test.wav")

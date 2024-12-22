from rest_framework import serializers
from audioapp.models import AudioFile


class AudioFileSerializer(serializers.ModelSerializer):
    file = serializers.FileField(use_url=False)

    class Meta:
        model = AudioFile
        fields = ["style", "file", "id"]

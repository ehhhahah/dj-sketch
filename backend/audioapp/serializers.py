from rest_framework import serializers
from audioapp.models import AudioFile


class AudioFileSerializer(serializers.ModelSerializer):
    file = serializers.FileField(use_url=False, help_text="Database name of file")
    title = serializers.CharField(required=False, help_text="Label for the audio file")
    style = serializers.CharField(required=True, help_text="File categorization")

    class Meta:
        model = AudioFile
        fields = ["style", "file", "id", "title"]

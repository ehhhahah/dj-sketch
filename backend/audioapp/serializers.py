from rest_framework import serializers
from audioapp.models import AudioFile


class AudioFileSerializer(serializers.ModelSerializer):
    file = serializers.FileField(use_url=False, help_text="Database name of file")
    title = serializers.CharField(required=False, help_text="Label for the audio file")
    style = serializers.CharField(required=True, help_text="File categorization")

    class Meta:
        model = AudioFile
        fields = ["style", "file", "id", "title"]


class AudioManipulationSerializer(serializers.Serializer):
    manipulation_type = serializers.ChoiceField(
        choices=[
            "spectral_freeze",
            "granular_synthesis",
            "spectral_morphing",
            "neural_style_transfer",
            "pitch_shift",
        ],
        help_text="Type of audio manipulation to perform",
    )
    parameters = serializers.DictField(
        required=False, help_text="Parameters for the manipulation algorithm"
    )


class ProcessedAudioSerializer(serializers.ModelSerializer):
    processing_info = serializers.SerializerMethodField()

    class Meta:
        model = AudioFile
        fields = ["id", "file", "style", "title", "processing_info"]

    def get_processing_info(self, obj):
        return self.context.get("processing_info", {})

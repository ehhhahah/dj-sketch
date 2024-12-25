from rest_framework import serializers
from audioapp.models import AudioFile, PlayHistory

from django.core.files.base import ContentFile
import os
from rest_framework import serializers


class AudioFileSerializer(serializers.ModelSerializer):
    file = serializers.FileField(
        use_url=True,  # Use URL representation
        required=True,
        help_text="Audio file in WAV format",
    )
    title = serializers.CharField(
        required=False, allow_blank=True, help_text="Label for the audio file"
    )
    style = serializers.CharField(required=True, help_text="File categorization")
    made_from = serializers.PrimaryKeyRelatedField(
        queryset=AudioFile.objects.all(),
        required=False,
        allow_null=True,
        help_text="Audio file used to create this one",
    )

    class Meta:
        model = AudioFile
        fields = ["id", "file", "title", "style", "created_at", "made_from"]
        read_only_fields = ["created_at"]

    def validate_file(self, value):
        """Validate that the file is a WAV file."""
        if not value.name.lower().endswith(".wav"):
            # Add .wav extension if missing
            name, ext = os.path.splitext(value.name)
            if ext:
                raise serializers.ValidationError(
                    "Invalid file extension. Please upload a WAV file."
                )
            value.name = f"{name}.wav"

        return value

    def create(self, validated_data):
        """Handle file creation with proper extension."""
        file_obj = validated_data.get("file")
        if file_obj and not file_obj.name.lower().endswith(".wav"):
            # Create new file with .wav extension
            name, ext = os.path.splitext(file_obj.name)
            if not ext:
                raise serializers.ValidationError(
                    "Invalid file extension. Please upload a WAV file."
                )

            new_name = f"{name}.wav"
            content = file_obj.read()
            file_obj = ContentFile(content, name=new_name)
            validated_data["file"] = file_obj

        return super().create(validated_data)

    def update(self, instance, validated_data):
        raise NotImplementedError("Updating audio files is not supported.")

    def to_representation(self, instance):
        """Customize the output representation."""
        data = super().to_representation(instance)

        # Ensure file URL uses .wav extension
        if data.get("file") and not data["file"].lower().endswith(".wav"):
            data["file"] = f"{data['file']}.wav"

        return data


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
    made_from = AudioFileSerializer()

    class Meta:
        model = AudioFile
        fields = ["id", "file", "style", "title", "processing_info", "made_from"]

    def get_processing_info(self, obj):
        return self.context.get("processing_info", {})


class PlayHistorySerializer(serializers.ModelSerializer):
    audio_file__id = serializers.IntegerField(source="audio_file.id")

    class Meta:
        model = PlayHistory
        fields = ["audio_file__id", "played_at"]
        read_only_fields = ["played_at"]

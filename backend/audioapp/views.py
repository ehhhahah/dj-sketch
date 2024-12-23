from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from audioapp.models import AudioFile
from audioapp.serializers import (
    AudioFileSerializer,
    AudioManipulationSerializer,
    ProcessedAudioSerializer,
)
from audioapp.services.audio_manipulator import AudioManipulator
import librosa  # pylint: disable=import-error


class AudioFileViewSet(viewsets.ModelViewSet):
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer

    @action(detail=False, methods=["get"], url_path="by-filename/(?P<filename>[^/.]+)")
    def retrieve_by_filename(self, request, filename: str):
        """Retrieve an audio file by its filename."""
        audio_file = get_object_or_404(AudioFile, file=filename)
        serializer = self.serializer_class(audio_file)
        return Response(serializer.data)


class AudioManipulationViewSet(viewsets.ViewSet):
    """
    ViewSet for audio manipulation operations.
    """

    serializer_class = AudioManipulationSerializer

    @action(detail=False, methods=["post"], url_path="process/(?P<audio_id>[^/.]+)")
    def process_audio(self, request, audio_id: int):
        """
        Process audio file with specified manipulation parameters.

        Args:
            audio_id: ID of the audio file to process
            request.data: {
                manipulation_type: str,
                parameters: dict,
                output_length: float
            }
        """
        # Validate input
        serializer = AudioManipulationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Get original audio file
        audio_file = get_object_or_404(AudioFile, id=audio_id)

        # Load audio data
        audio_data, sample_rate = librosa.load(audio_file.file, sr=None)  # type: ignore

        # Get manipulator
        manipulator = AudioManipulator()
        manipulation_type = serializer.validated_data["manipulation_type"]  # type: ignore

        # Process audio based on manipulation type
        method = getattr(manipulator, manipulation_type)
        parameters = serializer.validated_data.get("parameters", {})  # type: ignore
        processed_audio = method(audio_data, **parameters)

        # Export processed audio
        processed_file = manipulator.export_to_wav(
            processed_audio, style=manipulation_type
        )

        # Return processed file data
        response_serializer = ProcessedAudioSerializer(
            processed_file,
            context={
                "processing_info": {
                    "manipulation_type": manipulation_type,
                    "parameters": parameters,
                }
            },
        )
        return Response(response_serializer.data)

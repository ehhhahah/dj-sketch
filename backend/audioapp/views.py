from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from django_filters import rest_framework as filters
from drf_spectacular.utils import extend_schema

from audioapp.models import AudioFile, PlayHistory
from audioapp.serializers import (
    AudioFileSerializer,
    AudioManipulationSerializer,
    ProcessedAudioSerializer,
    PlayHistorySerializer,
)
from audioapp.filters import AudioFilter

from audioapp.services.audio_manipulator import AudioManipulator
import librosa  # pylint: disable=import-error


class AudioFileViewSet(viewsets.ModelViewSet):
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer
    http_method_names = ["get", "post", "head", "patch", "delete", "options"]
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = AudioFilter

    def create(self, request, *args, **kwargs):
        """Create a new audio file.

        The file must be a WAV file.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        """Allows to update all fields except the audio file."""
        if "file" in request.data:
            return Response(
                {"detail": "Audio file cannot be edited"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().partial_update(request, *args, **kwargs)


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
        try:
            processed_audio = method(audio_data, **parameters)
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Export processed audio
        processed_file = manipulator.export_to_wav(
            processed_audio, style=manipulation_type, made_from=audio_id
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


class PlayHistoryGetView(viewsets.GenericViewSet):
    queryset = PlayHistory.objects.all()
    serializer_class = PlayHistorySerializer
    http_method_names = ["get", "options"]

    @action(detail=False, methods=["get"], url_path="current")
    def current(self, request, *args, **kwargs):
        """Retrieve the last played audio file."""
        queryset = self.get_queryset()
        history = queryset.last()
        if history is None:
            return Response(
                {"detail": "No play history found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(history)
        return Response(serializer.data)

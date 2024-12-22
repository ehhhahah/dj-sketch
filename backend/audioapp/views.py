import os

from django.conf import settings

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from audioapp.models import AudioFile, StyleTransferModel
from audioapp.services.process_audio import process_audio

from audioapp.serializers import AudioFileSerializer


class AudioProcessingViewSet(viewsets.ModelViewSet):
    queryset = AudioFile.objects.all()
    serializer_class = AudioFileSerializer

    @action(detail=True, methods=["post"])
    def apply_style(self, request, pk=None):
        audio_file = self.get_object()

        # Load appropriate style model
        model = StyleTransferModel()
        # Here you would load pre-trained weights for the specific style

        output_path = os.path.join(
            settings.MEDIA_ROOT, f"processed_{audio_file.id}.wav"
        )
        processed_path = process_audio(audio_file.file.path, model, output_path)

        audio_file.processed = True
        audio_file.save()

        return Response({"status": "success", "processed_file": processed_path})

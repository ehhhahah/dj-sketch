# type: ignore
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from audioapp.models import AudioFile
from audioapp.services.audio_manipulator import AudioManipulator
import numpy as np


@pytest.mark.django_db
class TestAudioManipulationViewSet:
    def setup_method(self):
        self.client = APIClient()

    def test_process_audio(self, mocker):
        # Create a test audio file
        audio_file = AudioFile.objects.create(file="test_audio.wav", style="test_style")

        # Mock the librosa.load function to return a test audio array and sample rate
        mocker.patch("librosa.load", return_value=(np.random.randn(44100), 44100))

        # Mock the export_to_wav method to avoid file system operations
        mocker.patch.object(AudioManipulator, "export_to_wav", return_value=audio_file)

        # Define the manipulation parameters
        manipulation_data = {
            "manipulation_type": "granular_synthesis",
            "parameters": {"grain_size_ms": 50, "spacing_ms": 25, "pitch_shift": 0},
        }

        # Process the audio file
        url = reverse("audioapp:manipulate-process-audio", args=[audio_file.id])
        response = self.client.post(url, manipulation_data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["style"] == audio_file.style
        assert (
            response.data["processing_info"]["manipulation_type"]
            == manipulation_data["manipulation_type"]
        )
        assert (
            response.data["processing_info"]["parameters"]
            == manipulation_data["parameters"]
        )

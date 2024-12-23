# type: ignore
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from audioapp.models import AudioFile


@pytest.mark.django_db
class TestAudioFileViewSet:
    def setup_method(self):
        self.client = APIClient()

    def test_retrieve_by_filename(self):
        # Create a test audio file
        audio_file = AudioFile.objects.create(file="test_audio.wav", style="test_style")

        # Retrieve the audio file by filename
        url = reverse("audiofileviewset-retrieve_by_filename", args=[audio_file.file])
        response = self.client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["file"] == audio_file.file
        assert response.data["style"] == audio_file.style

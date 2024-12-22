import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from audioapp.models import AudioFile
from unittest.mock import patch
from audioapp.tests.factories import AudioFileFactory


@pytest.mark.django_db
class TestAudioViewSet:
    def test_retrieve_by_filename(self):
        audio_file = AudioFileFactory()
        client = APIClient()
        url = reverse(
            "audio",
            kwargs={"filename": audio_file.file.name},
        )
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["file"] == audio_file.file.name

    @patch("audioapp.views.process_audio")
    def test_apply_style(self, mock_process_audio):
        audio_file = AudioFileFactory()
        client = APIClient()
        url = reverse("audio-apply-style", kwargs={"pk": audio_file.id})
        response = client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "success"
        assert AudioFile.objects.get(id=audio_file.id).processed
        mock_process_audio.assert_called_once()

    @patch("audioapp.views.process_audio")
    def test_apply_style_with_model(self, mock_process_audio):
        audio_file = AudioFileFactory()
        client = APIClient()
        url = reverse("audio-apply-style", kwargs={"pk": audio_file.id})
        response = client.post(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["status"] == "success"
        assert AudioFile.objects.get(id=audio_file.id).processed
        mock_process_audio.assert_called_once()

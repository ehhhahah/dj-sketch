import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from audioapp.models import AudioFile
from audioapp.models import StyleTransferModel
from unittest.mock import patch
from django.core.files.uploadedfile import SimpleUploadedFile


@pytest.mark.django_db
class TestAudioViewSet:
    def test_list(self):
        client = APIClient()
        response = client.get(reverse("audioapp:uploads-list"))
        assert response.status_code == status.HTTP_200_OK

    def test_get(self):
        client = APIClient()
        response = client.get(reverse("audioapp:uploads-get", args=[1]))
        assert response.status_code == status.HTTP_200_OK

    def test_create(self):
        client = APIClient()
        file = SimpleUploadedFile("test.wav", b"file_content")
        response = client.post(
            reverse("audioapp:uploads-list"), {"style": "test", "file": file}
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert AudioFile.objects.count() == 1
        audio_file = AudioFile.objects.first()
        assert audio_file.style == "test"
        assert audio_file.file.name == "uploads/test.wav"
        audio_file.file.delete()

    def test_delete(self):
        client = APIClient()
        audio_file = AudioFile.objects.create(style="test")
        response = client.delete(
            reverse("audioapp:uploads-detail", args=[audio_file.id])
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert AudioFile.objects.count() == 0

    def test_update(self):
        client = APIClient()
        audio_file = AudioFile.objects.create(style="test")
        file = SimpleUploadedFile("test.wav", b"file_content")
        response = client.put(
            reverse("audioapp:uploads-detail", args=[audio_file.id]),
            {"style": "test", "file": file},
        )
        assert response.status_code == status.HTTP_200_OK
        audio_file.refresh_from_db()
        assert audio_file.file.name == "uploads/test.wav"
        audio_file.file.delete()

    def test_partial_update(self):
        client = APIClient()
        audio_file = AudioFile.objects.create(style="test")
        file = SimpleUploadedFile("test.wav", b"file_content")
        response = client.patch(
            reverse("audioapp:uploads-detail", args=[audio_file.id]),
            {"style": "test", "file": file},
        )
        assert response.status_code == status.HTTP_200_OK
        audio_file.refresh_from_db()
        assert audio_file.file.name == "uploads/test.wav"
        audio_file.file.delete()

    def test_apply_style(self):
        client = APIClient()
        audio_file = AudioFile.objects.create(style="test")
        model = StyleTransferModel()
        file = SimpleUploadedFile("test.wav", b"file_content")
        audio_file.file.save("test.wav", file)
        response = client.post(
            reverse("audioapp:uploads-apply_style", args=[audio_file.id])
        )
        assert response.status_code == status.HTTP_200_OK
        audio_file.refresh_from_db()
        assert audio_file.processed == True
        audio_file.file.delete()
        audio_file.delete()

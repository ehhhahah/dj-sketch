from django_filters import rest_framework as filters

from audioapp.models import AudioFile


class AudioFilter(filters.FilterSet):
    """Filter for audio files."""

    class Meta:
        model = AudioFile
        fields = {
            "title": ["exact", "icontains"],
            "created_at": ["exact", "lt", "gt"],
        }

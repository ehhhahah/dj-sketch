import os
from django.db import models
from django.utils.safestring import mark_safe
from django.conf import settings


class AudioFile(models.Model):
    """
    Model to store audio files
    """

    title = models.CharField(max_length=100, help_text="Title of the audio file")
    file = models.FileField(help_text="Upload an audio file")
    created_at = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False, help_text="Is the file processed?")
    style = models.CharField(max_length=50, help_text="Style of the audio file")
    made_from = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Audio file used to create this one",
    )

    objects = models.Manager()

    def __str__(self) -> str:
        return f"{self.title} - {self.style}"

    class Meta:
        verbose_name = "Audio File"
        verbose_name_plural = "Audio Files"

    @property
    def sound_display(self) -> str:
        """Play audio file in the admin panel"""
        if self.file:
            url = os.path.join(settings.MEDIA_URL, str(self.file))
            return mark_safe(
                f'<audio controls name="media"><source src="{url}" type="audio/wav"></audio>'
            )

        return ""

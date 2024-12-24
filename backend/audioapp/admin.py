from django.contrib import admin
from audioapp.models import AudioFile


@admin.register(AudioFile)
class AudioFileAdmin(admin.ModelAdmin):
    list_display = ("title", "style", "created_at", "file")
    list_filter = ("style", "processed")
    search_fields = ("title", "style")
    readonly_fields = (
        "created_at",
        "sound_display",
    )

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "title",
                    "file",
                    "sound_display",
                    "created_at",
                    "processed",
                    "style",
                    "made_from",
                )
            },
        ),
    )

    def sound_display(self, item):
        return item.sound_display

from django.contrib import admin
from audioapp.models import AudioFile, PlayHistory


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


@admin.register(PlayHistory)
class PlayHistoryAdmin(admin.ModelAdmin):
    list_display = ("audio_file", "played_at")
    list_filter = ("played_at",)
    search_fields = ("audio_file__title", "audio_file__style")
    readonly_fields = ("played_at",)
    date_hierarchy = "played_at"

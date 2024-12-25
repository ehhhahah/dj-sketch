import sys
import random
import asyncio

from asgiref.sync import sync_to_async
from loguru import logger
from django.core.management.base import BaseCommand
from pydub import AudioSegment
from aalink import Link  # pylint: disable=import-error disable=no-name-in-module
import sounddevice as sd  # pylint: disable=import-error
import numpy as np

from audioapp.models import AudioFile


# Configure logging
logger.remove()
logger.add("logs/file_{time}.log")
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>",
)


@sync_to_async
def load_random_audio() -> AudioSegment | None:
    audio_files = AudioFile.objects.all()
    if not audio_files:
        logger.error("No audio files found in the database.")
        return None
    random_file = random.choice(audio_files).file.path
    logger.info(f"Loaded random audio file: {random_file}")
    return AudioSegment.from_file(random_file)


async def stream_audio_with_link():
    """Stream audio data to the default output device using aalink."""

    loop = asyncio.get_running_loop()
    link = Link(120, loop)
    link.enabled = True

    while True:
        audio = await load_random_audio()
        if audio is None:
            logger.info("No more audio files to play. Exiting.")
            break

        # Convert pydub AudioSegment to numpy array
        audio_data = np.array(audio.get_array_of_samples())
        audio_data = audio_data.astype(np.float32) / (
            2**15
        )  # Normalize for sounddevice

        # Get the frame rate and ensure compatibility
        samplerate = audio.frame_rate

        try:
            # Set BlackHole as output device
            device_name = "BlackHole 2ch"  # Replace with your device name or index

            # Play on one
            await link.sync(1)
            sd.play(audio_data, samplerate=samplerate, device=device_name)

            logger.info("Audio playback finished.")
        except Exception as e:
            logger.error(f"Error during audio playback: {e}")


class Command(BaseCommand):
    help = "Stream random audio files from database"

    def handle(self, *args, **options):
        logger.info("Starting audio streaming")
        asyncio.run(stream_audio_with_link())

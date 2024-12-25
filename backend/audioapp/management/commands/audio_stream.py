import sys
import random
import asyncio

# import json

from asgiref.sync import sync_to_async
from loguru import logger
from django.core.management.base import BaseCommand
from pydub import AudioSegment
from aalink import Link  # pylint: disable=import-error disable=no-name-in-module
import sounddevice as sd  # pylint: disable=import-error
import numpy as nps

# from django_redis import get_redis_connection
from audioapp.models import AudioFile, PlayHistory


@sync_to_async
def load_random_audio() -> AudioSegment | None:
    audio_files = AudioFile.objects.all()
    if not audio_files:
        logger.error("No audio files found in the database.")
        return None
    instance = random.choice(audio_files)
    logger.info(f"Loaded random audio: {instance}")

    PlayHistory.objects.create(audio_file=instance)
    random_file = instance.file.path

    # send websocket
    # connection = get_redis_connection("default")
    # connection.publish("events", json.dumps(random_file))

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

            logger.debug("Audio playback finished.")
        except Exception as e:
            logger.error(f"Error during audio playback: {e}")


def configure_logging(debug_level: bool = False):
    logger.remove()
    logger.add("logs/file_{time}.log")
    logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>",
        level="INFO" if not debug_level else "DEBUG",
    )


class Command(BaseCommand):
    help = "Stream random audio files from database"

    def add_arguments(self, parser):
        parser.add_argument("--debug", action="store_true", help="Enable debug logs")

    def handle(self, *args, **options):
        configure_logging(options["debug"])
        logger.info("Starting audio streaming")
        try:
            asyncio.run(stream_audio_with_link())
        except KeyboardInterrupt:
            logger.info("Audio streaming stopped by user")

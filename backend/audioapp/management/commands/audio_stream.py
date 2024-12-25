import sys
import random
from loguru import logger
from django.core.management.base import BaseCommand
from pydub import AudioSegment
import sounddevice as sd  # pylint: disable=import-error
import numpy as np
from audioapp.models import AudioFile

# Configure logging
logger.add("logs/file_{time}.log")
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>",
)


def load_random_audio() -> AudioSegment | None:
    audio_files = AudioFile.objects.all()
    if not audio_files:
        logger.error("No audio files found in the database.")
        return None
    random_file = random.choice(audio_files).file.path
    logger.info(f"Loaded random audio file: {random_file}")
    return AudioSegment.from_file(random_file)


def load_and_concatenate_audio() -> AudioSegment:
    """Concatenate all audio files in the folder into one track."""
    combined_audio = AudioSegment.empty()
    audio_files = [f.file for f in AudioFile.objects.all()]
    if not audio_files:
        logger.error("No audio files to concatenate.")
        return combined_audio
    for filename in audio_files:
        try:
            audio = AudioSegment.from_wav(filename)
            combined_audio += audio
        except Exception as e:
            logger.error(f"Error loading file '{filename}': {e}")
    logger.debug(f"Combined audio duration: {combined_audio.duration_seconds} seconds")
    return combined_audio


def stream_audio(audio):
    """Stream audio data to the default output device."""

    # Convert pydub AudioSegment to numpy array
    audio_data = np.array(audio.get_array_of_samples())
    audio_data = audio_data.astype(np.float32) / (2**15)  # Normalize for sounddevice

    # Get the frame rate and ensure compatibility
    samplerate = audio.frame_rate

    try:
        # Set BlackHole as output device
        device_name = "BlackHole 2ch"  # Replace with your device name or index
        sd.play(audio_data, samplerate=samplerate, device=device_name)
        sd.wait()  # Wait for playback to finish
        logger.info("Audio playback finished.")
    except Exception as e:
        logger.error(f"Error during audio playback: {e}")


class Command(BaseCommand):
    help = "Stream random audio files from database"

    def handle(self, *args, **kwargs):
        logger.info("Starting audio streaming")
        while True:
            audio = load_random_audio()
            if audio is None:
                logger.info("No more audio files to play. Exiting.")
                break

            logger.info("Playing selected audio")
            stream_audio(audio.set_channels(2).set_frame_rate(44100))

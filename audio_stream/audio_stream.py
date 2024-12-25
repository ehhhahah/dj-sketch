import os
import random
import sys
from loguru import logger
import sounddevice as sd  # pylint: disable=import-error
from pydub import AudioSegment
from pydub.playback import play
import numpy as np

# Configure logging
logger.add("audio_stream/logs/file_{time}.log")
logger.add(
    sys.stdout,
    colorize=True,
    format="<green>{time}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>",
)


def list_audio_files(folder):
    """List all audio files in the folder."""
    audio_files = [f for f in os.listdir(folder) if f.lower().endswith(".wav")]
    if not audio_files:
        logger.warning(f"No .wav files found in folder: {folder}")
    else:
        logger.debug(f"Found {len(audio_files)} audio files in '{folder}'")
    return audio_files


def load_random_audio(folder):
    """Load a random audio file from the folder."""
    audio_files = list_audio_files(folder)
    if not audio_files:
        logger.error("No audio files to load.")
        return None
    try:
        random_file = random.choice(audio_files)
        audio = AudioSegment.from_wav(os.path.join(folder, random_file))
        logger.info(f"Loaded random audio file: {random_file}")
        return audio
    except Exception as e:
        logger.exception(f"Error loading random audio file: {e}")
        return None


def load_and_concatenate_audio(folder):
    """Concatenate all audio files in the folder into one track."""
    combined_audio = AudioSegment.empty()
    audio_files = list_audio_files(folder)
    if not audio_files:
        logger.error("No audio files to concatenate.")
        return combined_audio
    for filename in audio_files:
        try:
            audio = AudioSegment.from_wav(os.path.join(folder, filename))
            combined_audio += audio
        except Exception as e:
            logger.error(f"Error loading file '{filename}': {e}")
    logger.debug(f"Combined audio duration: {combined_audio.duration_seconds} seconds")
    return combined_audio


def stream_audio(audio):
    """Stream audio using sounddevice to BlackHole."""
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


def main():
    folder = "/Users/Guested/Documents/GitHub/dj-sketch/backend/uploads"
    if not os.path.exists(folder):
        logger.error(f"Folder '{folder}' does not exist.")
        return

    logger.info(f"Starting audio streaming from folder: {folder}")

    while True:
        audio = load_random_audio(folder)
        if audio is None:
            logger.info("No more audio files to play. Exiting.")
            break

        logger.info("Playing selected audio")
        stream_audio(audio.set_channels(2).set_frame_rate(44100))


if __name__ == "__main__":
    main()

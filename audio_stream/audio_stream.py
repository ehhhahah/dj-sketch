import os
import logging
import sounddevice as sd  # pylint: disable=import-error
from pydub import AudioSegment
from pydub.playback import play


# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def list_audio_files(folder):
    """List all audio files in the folder."""
    list = [f for f in os.listdir(folder) if f.lower().endswith(".wav")]
    logger.debug(f"Found {len(list)} audio files in '{folder}'")
    return list


def load_and_concatenate_audio(folder):
    combined_audio = AudioSegment.empty()
    for filename in os.listdir(folder):
        if filename.endswith(".wav"):
            audio = AudioSegment.from_wav(os.path.join(folder, filename))
            combined_audio += audio
    logger.debug(f"Combined audio duration: {combined_audio.duration_seconds} seconds")
    return combined_audio


def stream_audio(audio):
    """Stream audio data to the default output device."""

    def callback(outdata, frames, time, status):
        if status:
            logger.error(f"Error: {status}")
        data = audio.read(frames)
        outdata[:] = data

    stream = sd.OutputStream(
        samplerate=audio.frame_rate, channels=audio.channels, callback=callback
    )
    with stream:
        input("Press Enter to stop streaming...\n")


def main():
    folder = "/Users/Guested/Documents/GitHub/dj-sketch/backend/uploads"
    if not os.path.exists(folder):
        logger.error(f"Folder '{folder}' does not exist.")
        return

    logger.info(f"Listing audio files in '{folder}'")
    combined_audio = load_and_concatenate_audio(folder)

    # Ensure the audio has 2 channels (stereo)
    combined_audio = combined_audio.set_channels(2)

    logger.info("Playing combined audio")
    # Convert pydub AudioSegment to numpy array for streaming
    audio_array = combined_audio.get_array_of_samples()
    audio_np = combined_audio._data
    play(combined_audio)
    logger.info("Streaming combined audio")

    with sd.OutputStream(samplerate=combined_audio.frame_rate, channels=2) as stream:
        stream.write(audio_np)


if __name__ == "__main__":
    main()

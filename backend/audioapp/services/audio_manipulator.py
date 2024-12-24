import io
import uuid

import numpy as np
import librosa  # pylint: disable=import-error
import soundfile as sf

from audioapp.models import AudioFile
from django.core.files import File


class AudioManipulator:
    def __init__(self):
        self.sample_rate = 44100  # Default sample rate

    def segment_audio(self, audio_data, segment_size_ms=100):
        """Split audio into segments of specified size"""
        samples_per_segment = int(self.sample_rate * segment_size_ms / 1000)
        segments = []
        for i in range(0, len(audio_data), samples_per_segment):
            segment = audio_data[i : i + samples_per_segment]
            if len(segment) == samples_per_segment:  # Only keep full segments
                segments.append(segment)
        return segments

    def granular_synthesis(
        self, audio_data, grain_size_ms=50, spacing_ms=25, pitch_shift=0
    ):
        """
        Granular synthesis with pitch shifting
        - grain_size_ms: size of each grain in milliseconds
        - spacing_ms: space between grains in milliseconds
        - pitch_shift: semitones to shift (-12 to +12)
        """
        samples_per_grain = int(self.sample_rate * grain_size_ms / 1000)
        spacing_samples = int(self.sample_rate * spacing_ms / 1000)

        # Create grains
        grains = []
        for i in range(0, len(audio_data) - samples_per_grain, spacing_samples):
            grain = audio_data[i : i + samples_per_grain]
            # Apply Hanning window to avoid clicks
            grain = grain * np.hanning(len(grain))
            if pitch_shift != 0:
                grain = librosa.effects.pitch_shift(
                    grain.astype(float), sr=self.sample_rate, n_steps=pitch_shift
                )
            grains.append(grain)

        # Overlap-add grains
        output = np.zeros(len(audio_data))
        for i, grain in enumerate(grains):
            pos = i * spacing_samples
            if pos + len(grain) <= len(output):
                output[pos : pos + len(grain)] += grain

        return output

    def spectral_freeze(self, audio_data, frame_size=2048):
        """Freeze a moment in time and stretch it"""
        # Get spectral frame
        spectrum = np.fft.fft(audio_data[:frame_size])
        magnitude = np.abs(spectrum)
        phase = np.angle(spectrum)

        # Create stretched version
        stretched = np.zeros(len(audio_data))
        for i in range(0, len(audio_data) - frame_size, frame_size):
            # Randomize phase slightly for more natural sound
            random_phase = phase + np.random.uniform(-0.1, 0.1, len(phase))
            frame = np.fft.ifft(magnitude * np.exp(1j * random_phase)).real
            frame = frame * np.hanning(frame_size)
            stretched[i : i + frame_size] += frame

        return stretched

    def spectral_morphing(
        self, source_audio, target_audio: np.ndarray | None = None, morph_factor=0.5
    ):
        """Morph between two sounds in the spectral domain"""
        if not target_audio:
            # If no target audio is provided, get a random target
            target_audio = np.random.randn(len(source_audio))

        # Get spectra
        source_spectrum = np.fft.fft(source_audio)
        target_spectrum = np.fft.fft(target_audio[: len(source_audio)])  # Match lengths

        # Interpolate magnitudes and phases
        source_mag = np.abs(source_spectrum)
        target_mag = np.abs(target_spectrum)
        source_phase = np.angle(source_spectrum)
        target_phase = np.angle(target_spectrum)

        morph_mag = (1 - morph_factor) * source_mag + morph_factor * target_mag
        morph_phase = (1 - morph_factor) * source_phase + morph_factor * target_phase

        # Reconstruct audio
        morph_spectrum = morph_mag * np.exp(1j * morph_phase)
        morphed_audio = np.fft.ifft(morph_spectrum).real

        return morphed_audio

    def neural_style_transfer(self, content_audio, style_audio_id: int) -> np.ndarray:
        """
        Simple audio style transfer based on spectral features
        (This is a basic version - could be expanded with ML models)
        """
        # Load style audio
        style_audio, _ = librosa.load(
            AudioFile.objects.get(id=style_audio_id).file.path, sr=self.sample_rate
        )

        # Get content and style spectrograms
        content_spec = np.abs(librosa.stft(content_audio))
        style_spec = np.abs(librosa.stft(style_audio))

        # Match style spectrogram length
        if style_spec.shape[1] > content_spec.shape[1]:
            style_spec = style_spec[:, : content_spec.shape[1]]
        else:
            style_spec = np.pad(
                style_spec, ((0, 0), (0, content_spec.shape[1] - style_spec.shape[1]))
            )

        # Combine content and style
        output_spec = np.sqrt(content_spec * style_spec)

        # Reconstruct audio
        output_audio = librosa.griffinlim(output_spec)

        return output_audio

    def pitch_shift(self, audio_data: np.ndarray, shift: int) -> np.ndarray:
        """Shift the pitch of the audio"""
        return librosa.effects.pitch_shift(
            audio_data.astype(float), sr=self.sample_rate, n_steps=shift
        )

    def export_to_wav(self, audio_data: np.ndarray, style: str | None) -> AudioFile:
        """Export audio data to wav and save as AudioFile instance"""
        if not style:
            style = "style not specified"

        # Create an in-memory buffer instead of a temporary file
        buffer = io.BytesIO()
        sf.write(buffer, audio_data, self.sample_rate, format="WAV")

        # Rewind the buffer
        buffer.seek(0)

        # Generate a unique filename
        filename = f"processed_{uuid.uuid4().hex[:8]}.wav"

        # Create the AudioFile instance with the buffer
        audio_file = AudioFile.objects.create(
            file=File(buffer, name=filename), processed=True, style=style
        )

        return audio_file

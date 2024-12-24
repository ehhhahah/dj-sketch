import unittest
import numpy as np
from audioapp.services.audio_manipulator import AudioManipulator


class TestAudioManipulator(unittest.TestCase):
    def setUp(self):
        self.manipulator = AudioManipulator()
        self.sample_rate = self.manipulator.sample_rate
        self.audio_data = np.random.randn(
            self.sample_rate * 2
        )  # 2 seconds of random audio

    def test_segment_audio(self):
        segment_size_ms = 100
        segments = self.manipulator.segment_audio(self.audio_data, segment_size_ms)
        samples_per_segment = int(self.sample_rate * segment_size_ms / 1000)

        # Check if all segments are of the correct length
        for segment in segments:
            self.assertEqual(len(segment), samples_per_segment)

        # Check if the total number of segments is correct
        expected_num_segments = len(self.audio_data) // samples_per_segment
        self.assertEqual(len(segments), expected_num_segments)

    def test_granular_synthesis(self):
        grain_size_ms = 50
        spacing_ms = 25
        pitch_shift = 0
        synthesized_audio = self.manipulator.granular_synthesis(
            self.audio_data, grain_size_ms, spacing_ms, pitch_shift
        )

        # Check if the synthesized audio is not empty
        self.assertTrue(len(synthesized_audio) > 0)

        # Check if the synthesized audio is shorter than the original audio
        self.assertTrue(len(synthesized_audio) <= len(self.audio_data))


if __name__ == "__main__":
    unittest.main()

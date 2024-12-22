import torch
import torch.nn as nn
import torchaudio


def process_audio(audio_path, style_model, output_path):
    # Load audio file
    waveform, sample_rate = torchaudio.load(audio_path)

    # Preprocess
    if waveform.size(0) > 1:  # Convert stereo to mono if necessary
        waveform = torch.mean(waveform, dim=0, keepdim=True)

    # Apply style transfer
    with torch.no_grad():
        transformed = style_model(waveform)

    # Save processed audio
    torchaudio.save(output_path, transformed, sample_rate)
    return output_path

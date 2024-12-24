// Define a common type for parameter configuration
type ParameterConfig = {
  type: 'number'
  default: number
  description?: string
}

// Define all parameters in a single interface
interface ManipulationParameters {
  spectral_freeze: {
    frame_size: ParameterConfig
  }
  granular_synthesis: {
    grain_size_ms: ParameterConfig
    spacing_ms: ParameterConfig
    pitch_shift: ParameterConfig
  }
  spectral_morphing: {
    morph_audio_id: ParameterConfig
    morph_factor: ParameterConfig
  }
  neural_style_transfer: {
    style_audio_id: ParameterConfig
  }
  pitch_shift: {
    shift: ParameterConfig
  }
}

// Define the manipulation types object
export const AUDIO_MANIPULATION_TYPES = {
  SPECTRAL_FREEZE: {
    type: 'spectral_freeze',
    description: 'Freeze the spectral content of the audio',
    parameters: {
      frame_size: { type: 'number', default: 2048, description: 'Size of the frame in samples' }
    }
  },
  GRANULAR_SYNTHESIS: {
    type: 'granular_synthesis',
    description: 'Granular synthesis of the audio',
    parameters: {
      grain_size_ms: { type: 'number', default: 50, description: 'Size of the grain in milliseconds' },
      spacing_ms: { type: 'number', default: 25, description: 'Spacing between grains in milliseconds' },
      pitch_shift: { type: 'number', default: 0, description: 'Pitch shift in semitones' }
    }
  },
  SPECTRAL_MORPHING: {
    type: 'spectral_morphing',
    description: 'Morph between two audio signals',
    parameters: {
      morph_audio_id: { type: 'number', default: 0, description: 'ID of the morph audio' },
      morph_factor: { type: 'number', default: 0.5, description: 'Morph factor between 0 and 1' }
    }
  },
  NEURAL_STYLE_TRANSFER: {
    type: 'neural_style_transfer',
    description: 'Apply a style transfer to the audio',
    parameters: {
      style_audio_id: { type: 'number', default: 0, description: 'ID of the style audio' }
    }
  },
  PITCH_SHIFT: {
    type: 'pitch_shift',
    description: 'Shift the pitch of the audio',
    parameters: {
      shift: { type: 'number', default: 0.5, description: 'Pitch shift in semitones' }
    }
  }
} as const

// Export type for manipulation type strings
export type AudioManipulationType = keyof ManipulationParameters

// Export type for parameters
export type AudioManipulationParameters = ManipulationParameters[AudioManipulationType]

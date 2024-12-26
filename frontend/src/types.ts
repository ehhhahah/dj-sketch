import { AudioUploadSchema } from '../.././constants/serverSchemas'

// Pages

export interface ListUploadsProps {
  uploads: AudioUploadSchema[]
  getList: () => void
}

export interface AudioUploaderProps {
  getList: () => void
}

export interface AudioGeneratorProps {
  getList: () => void
}

// Components

export interface BaseModalProps {
  isOpen: boolean
  onRequestClose: () => void
  contentLabel: string
  children: React.ReactNode
}

export interface AudioSettingsFormProps {
  selectedNote: string
  setSelectedNote: (note: string) => void
  selectedOctave: number
  setSelectedOctave: (octave: number) => void
  selectedDuration: string
  setSelectedDuration: (duration: string) => void
}

export interface ManipulateProps {
  id: number
  isOpen: boolean
  onRequestClose: () => void
  getList: () => void
}

export interface GenADSRSettings {
  attack: number
  decay: number
  sustain: number
  release: number
}

export interface GenOscillatorSettings {
  type: 'sine' | 'square' | 'sawtooth' | 'triangle'
  detune: number
  volume: number
}

export interface GenFilterSettings {
  frequency: number
  type: 'lowpass' | 'highpass' | 'bandpass'
  Q: number
}

export interface GenSynthSettings {
  adsr: GenADSRSettings
  oscillator: GenOscillatorSettings
  filter: GenFilterSettings
}

export interface GenAudioSettings {
  note: string
  octave: number
  duration: string
}

// UI

export interface ServerButtonProps {
  title: string
  onClick: () => void
  processing: boolean
}

export interface SliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step: number
}

// utils

export interface uploadAudioProps {
  file: Blob
  style: string
  getList: () => void
  fileName?: string
}

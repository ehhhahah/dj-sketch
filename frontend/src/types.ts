// Server JSON response types

export interface AudioUpload {
  id: number
  title: string
  file: string
  style: string
}

export interface AudioManipulation {
  manipulation_type: 'spectral_freeze' | 'granular_synthesis' | 'spectral_morphing' | 'neural_style_transfer'
  parameters?: Record<string, any>
}

export interface ProcessedAudio {
  id: number
  file: string
  style: string
  title: string
  processing_info: Record<string, any>
}

// Pages

export interface ListUploadsProps {
  uploads: AudioUpload[]
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

export interface ServerButtonProps {
  title: string
  onClick: () => void
  processing: boolean
}

export interface ManipulateProps {
  id: number
  isOpen: boolean
  onRequestClose: () => void
  getList: () => void
}

// utils

export interface uploadAudioProps {
  file: Blob
  style: string
  getList: () => void
  fileName?: string
}

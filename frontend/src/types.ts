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

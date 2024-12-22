// Server JSON response types

export interface AudioUpload {
    id: number
    title: string
    file: string
    style: string
  }

  // Pages
  
  export interface ListUploadsProps {
    uploads: AudioUpload[]
    getList: () => void
  }
  
  export interface AudioProcessorProps {
    getList: () => void
  }
  
  export interface AudioGeneratorProps {
    getList: () => void
  }

  // Components

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
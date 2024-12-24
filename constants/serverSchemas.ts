import { AudioManipulationType } from './audioManipulationTypes'

export interface AudioUploadSchema {
  id: number
  title: string
  file: string
  style: string
  created_at: string
  made_from: number
}

export interface AudioManipulationSchema {
  manipulation_type: AudioManipulationType
  parameters?: Record<string, any>
}

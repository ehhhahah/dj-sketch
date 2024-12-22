export interface AudioUpload {
    id: number
    title: string
    file: string
    style: string
  }
  
  export interface ListUploadsProps {
    uploads: AudioUpload[]
    getList: () => void
  }

  export interface AudioProcessorProps {
    getList: () => void
  }
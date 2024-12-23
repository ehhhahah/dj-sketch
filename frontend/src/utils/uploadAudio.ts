import { toast } from 'sonner'
import { uploadAudioProps } from '../types'

export const uploadAudio = async ({
  file,
  style = 'not set',
  fileName = 'uploaded.wav',
  getList
}: uploadAudioProps) => {
  if (!file) {
    toast.error('No audio file to upload')
    return
  }

  const formData = new FormData()
  formData.append('file', file, fileName)
  formData.append('style', style)

  try {
    const response = await fetch('http://127.0.0.1:8000/api/audio/', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    toast.success('Audio uploaded successfully!')
    getList() // Call getList to refresh the list of uploads
  } catch (error) {
    toast.error('Error uploading the audio', error)
  }
}

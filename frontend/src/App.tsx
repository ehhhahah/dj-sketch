import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'sonner'
import AudioUploader from './pages/AudioUploader'
import ListUploads from './pages/ListUploads'
import AudioGenerator from './pages/AudioGenerator'
import { AudioUploadSchema } from '../../constants/serverSchemas'
import AudioRecorder from './pages/Microphone'

function App() {
  const [uploads, setUploads] = useState<AudioUploadSchema[]>([])

  const getList = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/audio/')
      setUploads(response.data)
    } catch (error) {
      toast.error('Error fetching the list of uploads', error)
    }
  }, [])

  return (
    <>
      <div className='mt-20'></div>
      <Toaster position='top-right' />
      <AudioRecorder getList={getList} />
      <AudioUploader getList={getList} />
      <AudioGenerator getList={getList} />
      <ListUploads uploads={uploads} getList={getList} />
    </>
  )
}

export default App

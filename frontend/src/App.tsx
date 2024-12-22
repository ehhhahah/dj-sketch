import React, { useState, useCallback } from 'react'
import AudioProcessor from './pages/AudioProcessor'
import { toast, Toaster } from 'sonner'
import ListUploads from './pages/ListUploads'
import axios from 'axios'
import { AudioUpload } from './types'

function App() {
  const [uploads, setUploads] = useState<AudioUpload[]>([])

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
      <Toaster position='top-right' />
      <AudioProcessor getList={getList} />
      <ListUploads uploads={uploads} getList={getList} />
    </>
  )
}

export default App

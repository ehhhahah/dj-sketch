import React, { useState, useCallback } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'sonner'
import AudioProcessor from './pages/AudioProcessor'
import ListUploads from './pages/ListUploads'
import AudioGenerator from './pages/AudioGenerator'
import { AudioUpload } from './types'
import Logo from './components/Logo'

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
      <div className='mt-20'></div>
      <Toaster position='top-right' />
      <AudioProcessor getList={getList} />
      <AudioGenerator getList={getList} />
      <ListUploads uploads={uploads} getList={getList} />
    </>
  )
}

export default App

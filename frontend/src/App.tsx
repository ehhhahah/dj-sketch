import React, { useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'sonner'
import AudioUploader from './pages/AudioUploader'
import ListUploads from './pages/ListUploads'
import AudioGenerator from './pages/AudioGenerator'
import { AudioUploadSchema } from '../../constants/serverSchemas'
import AudioRecorder from './pages/Microphone'
import DisplayNodes from './pages/DisplayNodes'

function App() {
  const [uploads, setUploads] = useState<AudioUploadSchema[]>([])
  const [dividerY, setDividerY] = useState(window.innerHeight / 2)

  const dividerRef = useRef<HTMLDivElement>(null)

  const getList = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/audio/')
      setUploads(response.data)
    } catch (error) {
      toast.error('Error fetching the list of uploads', error)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    const startY = e.clientY
    const startHeight = dividerY

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = startHeight + (e.clientY - startY)
      setDividerY(newHeight)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleDoubleClick = () => {
    setDividerY(window.innerHeight / 2)
  }

  return (
    <div className='flex flex-col h-screen'>
      <Toaster position='top-right' />
      <div className='overflow-y-auto' style={{ height: dividerY }}>
        <AudioRecorder getList={getList} />
        <AudioUploader getList={getList} />
        <AudioGenerator getList={getList} />
      </div>
      <div ref={dividerRef} className='break-line' onMouseDown={handleMouseDown} onDoubleClick={handleDoubleClick}>
        <div className='resize-dot' />
      </div>
      <div className='overflow-y-auto' style={{ height: `calc(100% - ${dividerY}px - 2px)` }}>
        <ListUploads uploads={uploads} getList={getList} />
        <DisplayNodes uploads={uploads} />
      </div>
    </div>
  )
}
export default App

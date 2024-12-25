import React, { useState, useCallback, useRef } from 'react'
import axios from 'axios'
import { toast, Toaster } from 'sonner'
import AudioUploader from './pages/AudioUploader'
import ListUploads from './pages/ListUploads'
import AudioGenerator from './pages/AudioGenerator'
import { AudioUploadSchema } from '../../constants/serverSchemas'
import AudioRecorder from './pages/Microphone'
import DisplayNodes from './pages/DisplayNodes'

import './stylees/divider.css'

function App() {
  const [isMd, setIsMd] = useState(window.innerWidth >= 768)

  const [uploads, setUploads] = useState<AudioUploadSchema[]>([])
  const [dividerY, setDividerY] = useState(window.innerHeight / 2)
  const [dividerX, setDividerX] = useState(window.innerWidth / 2)
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
    const startX = e.clientX
    const startHeight = dividerY
    const startWidth = dividerX

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 768) {
        const newWidth = startWidth + (e.clientX - startX)
        setIsMd(true)
        setDividerX(newWidth)
      } else {
        const newHeight = startHeight + (e.clientY - startY)
        setIsMd(false)
        setDividerY(newHeight)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleDoubleClick = () => {
    if (isMd) {
      setDividerX(window.innerWidth / 2)
    } else {
      setDividerY(window.innerHeight / 2)
    }
  }

  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <Toaster position='top-right' />
      <div className='overflow-y-auto' style={{ height: isMd ? '100%' : dividerY, width: isMd ? dividerX : '100%' }}>
        <AudioRecorder getList={getList} />
        <AudioUploader getList={getList} />
        <AudioGenerator getList={getList} />
      </div>
      <div
        ref={dividerRef}
        className='break-line'
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: isMd ? 'col-resize' : 'row-resize' }}>
        <div className='resize-dot' />
      </div>
      <div
        className='overflow-y-auto'
        style={{
          height: isMd ? '100%' : window.innerHeight - dividerY,
          width: isMd ? window.innerWidth - dividerX : '100%'
        }}>
        <ListUploads uploads={uploads} getList={getList} />
        <DisplayNodes uploads={uploads} />
      </div>
    </div>
  )
}

export default App

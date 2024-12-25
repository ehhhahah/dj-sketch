import React, { useState, useEffect } from 'react'
import { GraphCanvas, darkTheme } from 'reagraph'
import { AudioUploadSchema } from '../../../constants/serverSchemas'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { motion } from 'framer-motion'
import '../stylees/graph.css'
import { relativeDate } from '../utils/relativeDate'

interface DisplayNodesProps {
  uploads: AudioUploadSchema[]
}

const DisplayNodes: React.FC<DisplayNodesProps> = ({ uploads }) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [currentFile, setCurrentFile] = useState<string | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8888/')
    ws.onopen = () => {
      console.log('WebSocket connected')
    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setCurrentFile(data.message)
      console.log(data.message)
    }
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
    ws.onclose = (event) => {
      console.log('WebSocket closed:', event)
    }
    return () => ws.close()
  }, [])

  const nodes = uploads.map((upload) => ({
    id: upload.id.toString(),
    label: upload.title || upload.file.split('/').pop() || 'Unknown',
    subLabel: `#${upload.id.toString()} (${relativeDate(upload.created_at, 'created_at')})`,
    color: currentFile === upload.file ? '#f00' : '#0f0'
  }))

  const edges = uploads
    .filter((upload) => upload.made_from !== null)
    .map((upload) => ({
      source: upload.made_from.toString(),
      target: upload.id.toString(),
      id: `${upload.made_from}-${upload.id}`,
      label: `${upload.made_from}-${upload.id}`
    }))

  return (
    <div className='container'>
      <div className='menu-header' onClick={() => setExpanded(!expanded)}>
        <h1 className='section-title'>
          <span>Graph</span> of uploads
        </h1>
        <button className='text-lg'>{expanded ? <MdExpandLess /> : <MdExpandMore />}</button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className='overflow-hidden'>
        <div className='graph-container'>
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            theme={{
              ...darkTheme,
              canvas: {
                ...darkTheme.canvas,
                background: '#222'
              },
              node: {
                ...darkTheme.node,
                fill: '#000'
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default DisplayNodes

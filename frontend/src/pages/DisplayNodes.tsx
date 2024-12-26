import React, { useState, useEffect } from 'react'
import { GraphCanvas, darkTheme, lightTheme } from 'reagraph'
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
  const [currentFile, setCurrentFile] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://127.0.0.1:8000/api/history/current/')
        .then((response) => response.json())
        .then((data) => {
          setCurrentFile(data.audio_file__id)
        })
    }, 1000)
    return () => clearInterval(interval)
  })

  const nodes = uploads.map((upload) => ({
    id: upload.id.toString(),
    label: upload.title || upload.file.split('/').pop() || 'Unknown',
    subLabel: `#${upload.id.toString()} (${relativeDate(upload.created_at, 'created_at')})`
  }))

  const edges = uploads
    .filter((upload) => upload.made_from !== null)
    .map((upload) => ({
      source: upload.made_from.toString(),
      target: upload.id.toString(),
      id: `${upload.made_from}-${upload.id}`,
      label: `${upload.made_from}-${upload.id}`
    }))

  const theTheme = document.documentElement.classList.contains('dark')
    ? {
        ...darkTheme,
        canvas: {
          ...darkTheme.canvas,
          background: '#222'
        },
        node: {
          ...darkTheme.node,
          fill: '#000'
        }
      }
    : {
        ...lightTheme,
        canvas: {
          ...lightTheme.canvas
        },
        node: {
          ...lightTheme.node
        }
      }

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
            selections={currentFile ? [currentFile.toString()] : []}
            theme={theTheme}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default DisplayNodes

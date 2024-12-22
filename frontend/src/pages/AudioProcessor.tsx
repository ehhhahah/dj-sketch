import React, { useState } from 'react'
import { FaUpload as Upload, FaMusic as Music } from 'react-icons/fa'
import { toast } from 'sonner'
import { AudioProcessorProps } from '../types'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { motion } from 'framer-motion'
import ServerButton from '../components/ServerButton'

const AudioProcessor: React.FC<AudioProcessorProps> = ({ getList }) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState('classical')

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
      setFile(uploadedFile)
    }
  }

  const processAudio = async () => {
    if (!file) return

    setProcessing(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('style', selectedStyle)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/audio/', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.processed_file)
      getList() // Call getList on successful audio processing
    } catch (error) {
      toast.error(
        <div className='flex items-center'>
          <Music className='w-6 h-6 mr-2' />
          <span className='font-bold mr-2'>Error processing audio</span>
          <span className='ml-auto text-sm text-zinc-400'>{error.message}</span>
        </div>
      )
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className='container'>
      <div className='menu-header' onClick={() => setExpanded(!expanded)}>
        <h1 className='section-title'>Neural Music Style Transfer</h1>
        <button className='text-lg'>{expanded ? <MdExpandLess /> : <MdExpandMore />}</button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className='overflow-hidden'>
        <div className='space-y-4'>
          <div>
            <p className='text-muted mb-2'>Transform your music into different styles using AI</p>

            <div className='space-y-4'>
              <div className='card text-center'>
                <input type='file' accept='audio/*' onChange={handleFileUpload} className='hidden' id='audio-upload' />
                <label htmlFor='audio-upload' className='flex flex-col items-center cursor-pointer text-muted'>
                  <motion.div animate={{ y: file ? [] : [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Upload className='w-12 h-12' />
                  </motion.div>
                  <span className='mt-2 text-sm'>{file ? file.name : 'Upload your audio file'}</span>
                </label>
              </div>

              <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className='dropdown'>
                <option value='classical'>Classical</option>
                <option value='jazz'>Jazz</option>
                <option value='rock'>Rock</option>
              </select>
              <ServerButton title='Transform Audio' onClick={processAudio} processing={!file || processing} />
            </div>

            {result &&
              toast.success(
                <div className='flex items-center'>
                  <Music className='w-6 h-6 mr-2' />
                  <span>Audio processed successfully!</span>
                </div>
              )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AudioProcessor

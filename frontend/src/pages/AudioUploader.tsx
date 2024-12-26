import React, { useState } from 'react'
import { FaUpload as Upload, FaMusic as Music } from 'react-icons/fa'
import { toast } from 'sonner'
import { AudioUploaderProps } from '../types'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { motion } from 'framer-motion'
import ServerButton from '../components/ui/ServerButton'
import { uploadAudio } from '../utils/uploadAudio'

const AudioUploader: React.FC<AudioUploaderProps> = ({ getList }) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
      setFile(uploadedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setProcessing(true)
    await uploadAudio({ file, getList, style: 'uploaded' })
    setProcessing(false)
  }

  return (
    <div className='container'>
      <div className='menu-header' onClick={() => setExpanded(!expanded)}>
        <h1 className='section-title'>
          <span>Upload</span> audio
        </h1>
        <button className='text-lg'>{expanded ? <MdExpandLess /> : <MdExpandMore />}</button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className='expanded-parent'>
        <div className='expanded-content'>
          <div className='card text-center'>
            <input type='file' accept='audio/*' onChange={handleFileUpload} className='hidden' id='audio-upload' />
            <label htmlFor='audio-upload' className='flex flex-col items-center cursor-pointer text-muted'>
              <motion.div animate={{ y: file ? [] : [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Upload className='w-12 h-12' />
              </motion.div>
              <span className='mt-2 text-sm'>{file ? file.name : 'Upload your audio file'}</span>
            </label>
          </div>

          <ServerButton title='Upload audio' onClick={handleUpload} processing={!file || processing} />

          {result &&
            toast.success(
              <div className='flex items-center'>
                <Music className='w-6 h-6 mr-2' />
                <span>Audio uploaded successfully!</span>
              </div>
            )}
        </div>
      </motion.div>
    </div>
  )
}

export default AudioUploader

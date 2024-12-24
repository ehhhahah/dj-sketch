import React, { useState, useRef } from 'react'
import { FaMicrophone as Microphone, FaStop as Stop } from 'react-icons/fa'
import { toast } from 'sonner'
import { AudioUploaderProps } from '../types'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { motion } from 'framer-motion'
import ServerButton from '../components/ServerButton'
import { uploadAudio } from '../utils/uploadAudio'

const AudioRecorder: React.FC<AudioUploaderProps> = ({ getList }) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [recording, setRecording] = useState<boolean>(false)
  const [processing, setProcessing] = useState<boolean>(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (error) {
      toast.error('Error accessing microphone', error)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  const handleUpload = async () => {
    if (!audioBlob) return

    setProcessing(true)
    await uploadAudio({ file: audioBlob, getList, style: 'recorded' })
    setProcessing(false)
  }

  return (
    <div className='container'>
      <div className='menu-header' onClick={() => setExpanded(!expanded)}>
        <h1 className='section-title'>Record Audio</h1>
        <button className='text-lg'>{expanded ? <MdExpandLess /> : <MdExpandMore />}</button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className='overflow-hidden'>
        <div className='space-y-4'>
          <div className='flex flex-col items-center'>
            {recording ? (
              <button onClick={handleStopRecording} className='record-button stop'>
                <Stop className='w-6 h-6' />
                <span className='mt-2 text-sm'>Stop Recording</span>
              </button>
            ) : (
              <button onClick={handleStartRecording} className='record-button record'>
                <Microphone className='w-6 h-6' />
                <span className='mt-2 text-sm'>Start Recording</span>
              </button>
            )}
          </div>
          {audioBlob && (
            <div className='card'>
              <audio controls src={URL.createObjectURL(audioBlob)} className='audio' />
            </div>
          )}
          <ServerButton title='Upload Audio' onClick={handleUpload} processing={processing || !audioBlob} />
        </div>
      </motion.div>
    </div>
  )
}

export default AudioRecorder

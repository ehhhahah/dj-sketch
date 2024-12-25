import React, { useState, useRef } from 'react'
import { FaMicrophone as Microphone, FaStop as Stop } from 'react-icons/fa'
import { toast } from 'sonner'
import { AudioUploaderProps } from '../types'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { motion } from 'framer-motion'
import ServerButton from '../components/ServerButton'
import { uploadAudio } from '../utils/uploadAudio'

interface AudioRecorderState {
  expanded: boolean
  recording: boolean
  processing: boolean
  audioBlob: Blob | null
  audioUrl: string | null
}

const AudioRecorder: React.FC<AudioUploaderProps> = ({ getList }) => {
  const [state, setState] = useState<AudioRecorderState>({
    expanded: false,
    recording: false,
    processing: false,
    audioBlob: null,
    audioUrl: null
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm' // Most widely supported format
      })

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        try {
          // Create blob in WebM format first
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })

          // Convert to WAV using Web Audio API
          const audioContext = new AudioContext()
          const audioBuffer = await audioBlob.arrayBuffer()
          const audioData = await audioContext.decodeAudioData(audioBuffer)

          // Create WAV blob
          const wavBlob = await convertToWav(audioData)
          const wavUrl = URL.createObjectURL(wavBlob)

          setState((prev) => ({
            ...prev,
            audioBlob: wavBlob,
            audioUrl: wavUrl
          }))
        } catch (error) {
          toast.error('Error processing audio')
          console.error('Audio processing error:', error)
        }
      }

      mediaRecorder.start(200) // Collect data every 200ms
      setState((prev) => ({ ...prev, recording: true }))
    } catch (error) {
      toast.error('Error accessing microphone')
      console.error('Microphone error:', error)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && state.recording) {
      mediaRecorderRef.current.stop()
      // Clean up media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      setState((prev) => ({ ...prev, recording: false }))
    }
  }

  const handleUpload = async () => {
    if (!state.audioBlob) return

    setState((prev) => ({ ...prev, processing: true }))
    try {
      await uploadAudio({
        file: state.audioBlob,
        getList,
        style: 'recorded'
      })
      // Clear recording after successful upload
      setState((prev) => ({
        ...prev,
        audioBlob: null,
        audioUrl: null,
        processing: false
      }))
      toast.success('Audio uploaded successfully')
    } catch (error) {
      toast.error('Upload failed')
      console.error('Upload error:', error)
      setState((prev) => ({ ...prev, processing: false }))
    }
  }

  // Function to convert AudioBuffer to WAV format
  const convertToWav = async (audioBuffer: AudioBuffer): Promise<Blob> => {
    const numOfChannels = audioBuffer.numberOfChannels
    const length = audioBuffer.length * numOfChannels * 2
    const buffer = new ArrayBuffer(44 + length)
    const view = new DataView(buffer)

    // Write WAV header
    writeUTFBytes(view, 0, 'RIFF')
    view.setUint32(4, 36 + length, true)
    writeUTFBytes(view, 8, 'WAVE')
    writeUTFBytes(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numOfChannels, true)
    view.setUint32(24, audioBuffer.sampleRate, true)
    view.setUint32(28, audioBuffer.sampleRate * 2, true)
    view.setUint16(32, numOfChannels * 2, true)
    view.setUint16(34, 16, true)
    writeUTFBytes(view, 36, 'data')
    view.setUint32(40, length, true)

    // Write audio data
    const channels = []
    for (let i = 0; i < numOfChannels; i++) {
      // @ts-ignore
      channels.push(audioBuffer.getChannelData(i))
    }

    let offset = 44
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channels[channel][i]))
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
        offset += 2
      }
    }

    return new Blob([buffer], { type: 'audio/wav' })
  }

  const writeUTFBytes = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  return (
    <div className='container'>
      <div className='menu-header' onClick={() => setState((prev) => ({ ...prev, expanded: !prev.expanded }))}>
        <h1 className='section-title'>
          <span>Record</span> audio
        </h1>
        <button className='text-lg'>{state.expanded ? <MdExpandLess /> : <MdExpandMore />}</button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: state.expanded ? 'auto' : 0, opacity: state.expanded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className='overflow-hidden'>
        <div className='space-y-4'>
          <div className='flex flex-col items-center'>
            {state.recording ? (
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
          {state.audioBlob && state.audioUrl && (
            <div className='card'>
              <audio controls src={state.audioUrl} className='audio' />
            </div>
          )}
          <ServerButton title='Upload Audio' onClick={handleUpload} processing={state.processing || !state.audioBlob} />
        </div>
      </motion.div>
    </div>
  )
}

export default AudioRecorder

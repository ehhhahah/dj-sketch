import React, { useState } from 'react'
import * as Tone from 'tone'
import { toast } from 'sonner'
import { AudioGeneratorProps } from '../types'
import WavEncoder from 'wav-encoder'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { motion } from 'framer-motion'
import AudioSettingsForm from '../components/AudioSettingsForm'
import ServerButton from '../components/ServerButton'
import { uploadAudio } from '../utils/uploadAudio'

const AudioGenerator: React.FC<AudioGeneratorProps> = ({ getList }) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [processing, setProcessing] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [selectedNote, setSelectedNote] = useState('C')
  const [selectedOctave, setSelectedOctave] = useState(4)
  const [selectedDuration, setSelectedDuration] = useState('8n')

  const generateAudio = async () => {
    setProcessing(true)

    // Render the audio to a buffer
    const buffer = await Tone.Offline(() => {
      const synth = new Tone.Synth().toDestination()
      synth.triggerAttackRelease(selectedNote + selectedOctave, selectedDuration, 0)
    }, 1)

    // Encode the buffer to a WAV file
    const audioBuffer = buffer.get()
    const wavData = await WavEncoder.encode({
      sampleRate: audioBuffer?.sampleRate,
      channelData: [audioBuffer?.getChannelData(0)]
    })
    const audioBlob = new Blob([wavData], { type: 'audio/wav' })
    setAudioBlob(audioBlob)

    // Create a URL for the audio Blob
    const audioUrl = URL.createObjectURL(audioBlob)
    setAudioUrl(audioUrl)

    toast.success('Audio generated successfully!')
    setProcessing(false)
  }

  const handleUpload = async () => {
    if (!audioBlob) {
      toast.error('No audio generated to upload')
      return
    }

    setProcessing(true)
    const audioName = 'generated' + selectedNote + selectedOctave + '_' + selectedDuration
    await uploadAudio({ file: audioBlob, style: 'generated', fileName: audioName, getList })
    setProcessing(false)
  }

  return (
    <div className='container'>
      <div className='menu-header' onClick={() => setExpanded(!expanded)}>
        <h1 className='section-title'>Generate Audio</h1>
        <button className='text-lg'>{expanded ? <MdExpandLess /> : <MdExpandMore />}</button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className='overflow-hidden'>
        <div className='space-y-4'>
          <div className='space-y-4'>
            <AudioSettingsForm
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              selectedOctave={selectedOctave}
              setSelectedOctave={setSelectedOctave}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
            />
            <button onClick={generateAudio} disabled={processing} className='button-full'>
              {processing ? 'Processing...' : 'Generate Audio'}
            </button>
            {audioUrl && (
              <div className='card'>
                <audio controls src={audioUrl} className='audio' />
              </div>
            )}

            <ServerButton title='Upload Audio' onClick={handleUpload} processing={processing || !audioBlob} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AudioGenerator

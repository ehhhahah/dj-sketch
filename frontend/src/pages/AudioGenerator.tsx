import React, { useState } from 'react'
import { toast } from 'sonner'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { motion } from 'framer-motion'
import AudioSettingsForm from '../components/audioGen/AudioSettingsForm'
import EnvelopeControls from '../components/audioGen/EnvelopeControls'
import OscillatorControls from '../components/audioGen/OscillatorControls'
import FilterControls from '../components/audioGen/FilterControls'
import ServerButton from '../components/ui/ServerButton'
import { useSynthEngine } from '../hooks/useSynthEngine'
import { uploadAudio } from '../utils/uploadAudio'

const defaultSynthSettings: SynthSettings = {
  adsr: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1 },
  oscillator: { type: 'sine', detune: 0, volume: -12 },
  filter: { frequency: 2000, type: 'lowpass', Q: 1 }
}

const AudioGenerator: React.FC<AudioGeneratorProps> = ({ getList }) => {
  const [expanded, setExpanded] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    note: 'C',
    octave: 4,
    duration: '8n'
  })
  const [synthSettings, setSynthSettings] = useState<SynthSettings>(defaultSynthSettings)

  const { audioBlob, audioUrl, generateAudio } = useSynthEngine()

  const handleGenerate = async () => {
    setProcessing(true)
    try {
      await generateAudio(audioSettings, synthSettings)
      toast.success('Audio generated successfully!')
    } catch (error) {
      toast.error('Failed to generate audio')
    }
    setProcessing(false)
  }

  const handleUpload = async () => {
    if (!audioBlob) {
      toast.error('No audio generated to upload')
      return
    }

    setProcessing(true)
    const audioName = `generated_${audioSettings.note}${audioSettings.octave}_${audioSettings.duration}`
    try {
      await uploadAudio({ file: audioBlob, style: 'generated', fileName: audioName, getList })
      toast.success('Audio uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload audio')
    }
    setProcessing(false)
  }

  return (
    <div className='container'>
      <div className='menu-header' onClick={() => setExpanded(!expanded)}>
        <h1 className='section-title'>
          <span>Generate</span> audio
        </h1>
        <button className='text-lg'>{expanded ? <MdExpandLess /> : <MdExpandMore />}</button>
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className='expanded-parent'>
        <div className='expanded-content space-y-6'>
          <AudioSettingsForm
            audioSettings={audioSettings}
            synthSettings={synthSettings}
            onAudioSettingsChange={setAudioSettings}
            onSynthSettingsChange={setSynthSettings}
          />

          <div className='space-y-4'>
            <button onClick={handleGenerate} disabled={processing} className='button-full'>
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

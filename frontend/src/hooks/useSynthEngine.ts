import { useState, useCallback } from 'react'
import * as Tone from 'tone'
import WavEncoder from 'wav-encoder'
import { GenAudioSettings as AudioSettings, GenSynthSettings as SynthSettings } from '../types'

export const useSynthEngine = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const generateAudio = useCallback(async (audioSettings: AudioSettings, synthSettings: SynthSettings) => {
    const buffer = await Tone.Offline(() => {
      const filter = new Tone.Filter({
        frequency: synthSettings.filter.frequency,
        type: synthSettings.filter.type,
        Q: synthSettings.filter.Q
      }).toDestination()

      const synth = new Tone.Synth({
        oscillator: {
          type: synthSettings.oscillator.type
        },
        detune: synthSettings.oscillator.detune,
        envelope: {
          attack: synthSettings.adsr.attack,
          decay: synthSettings.adsr.decay,
          sustain: synthSettings.adsr.sustain,
          release: synthSettings.adsr.release
        }
      }).connect(filter)

      synth.volume.value = synthSettings.oscillator.volume
      synth.triggerAttackRelease(audioSettings.note + audioSettings.octave, audioSettings.duration, 0)
    }, 2)

    const audioBuffer = buffer.get()
    const wavData = await WavEncoder.encode({
      sampleRate: audioBuffer?.sampleRate,
      channelData: [audioBuffer?.getChannelData(0)]
    })

    const blob = new Blob([wavData], { type: 'audio/wav' })
    setAudioBlob(blob)
    setAudioUrl(URL.createObjectURL(blob))

    return blob
  }, [])

  return {
    audioBlob,
    audioUrl,
    generateAudio
  }
}

import React from 'react'
import { AudioSettingsFormProps } from '../types'

const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const octaves = Array.from({ length: 8 }, (_, i) => i)
const durations = ['8n', '4n', '2n', '1n']

const AudioSettingsForm: React.FC<AudioSettingsFormProps> = ({
  selectedNote,
  setSelectedNote,
  selectedOctave,
  setSelectedOctave,
  selectedDuration,
  setSelectedDuration
}) => {
  return (
    <div className='card'>
      <label className='block mb-2'>
        Select Note:
        <select value={selectedNote} onChange={(e) => setSelectedNote(e.target.value)} className='dropdown'>
          {notes.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
      </label>
      <label className='block mb-2'>
        Select Octave:
        <select value={selectedOctave} onChange={(e) => setSelectedOctave(Number(e.target.value))} className='dropdown'>
          {octaves.map((octave) => (
            <option key={octave} value={octave}>
              {octave}
            </option>
          ))}
        </select>
      </label>
      <label className='block mb-2'>
        Select Duration:
        <select value={selectedDuration} onChange={(e) => setSelectedDuration(e.target.value)} className='dropdown'>
          {durations.map((duration) => (
            <option key={duration} value={duration}>
              {duration}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default AudioSettingsForm

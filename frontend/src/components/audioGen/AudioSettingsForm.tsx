import React, { useState } from 'react'

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const octaves = Array.from({ length: 8 }, (_, i) => i)
const durations = ['32n', '16n', '8n', '4n', '2n', '1n']

const AudioSettingsForm = ({ audioSettings, synthSettings, onAudioSettingsChange, onSynthSettingsChange }) => {
  const [activeTab, setActiveTab] = useState('basic')

  const handleEnvelopeChange = (key, value) => {
    onSynthSettingsChange({
      ...synthSettings,
      adsr: { ...synthSettings.adsr, [key]: value }
    })
  }

  const handleOscillatorChange = (key, value) => {
    onSynthSettingsChange({
      ...synthSettings,
      oscillator: { ...synthSettings.oscillator, [key]: value }
    })
  }

  const handleFilterChange = (key, value) => {
    onSynthSettingsChange({
      ...synthSettings,
      filter: { ...synthSettings.filter, [key]: value }
    })
  }

  return (
    <div className='card'>
      {/* Tab Navigation */}
      <div className='card-tab'>
        {['basic', 'envelope', 'oscillator', 'filter'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''}>
            {tab}
          </button>
        ))}
      </div>

      {/* Basic Settings */}
      <div className={`space-y-4 ${activeTab === 'basic' ? 'block' : 'hidden'}`}>
        <div>
          <label className='setting-label'>Note</label>
          <select
            value={audioSettings.note}
            onChange={(e) => onAudioSettingsChange({ ...audioSettings, note: e.target.value })}
            className='dropdown'>
            {notes.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='setting-label'>Octave</label>
          <select
            value={audioSettings.octave}
            onChange={(e) => onAudioSettingsChange({ ...audioSettings, octave: Number(e.target.value) })}
            className='dropdown'>
            {octaves.map((octave) => (
              <option key={octave} value={octave}>
                {octave}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='setting-label'>Duration</label>
          <select
            value={audioSettings.duration}
            onChange={(e) => onAudioSettingsChange({ ...audioSettings, duration: e.target.value })}
            className='dropdown'>
            {durations.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Envelope Controls */}
      <div className={`space-y-4 ${activeTab === 'envelope' ? 'block' : 'hidden'}`}>
        {Object.entries(synthSettings.adsr).map(([key, value]) => (
          <div key={key}>
            <label className='setting-label'>{key}</label>
            <div className='flex items-center space-x-2'>
              <input
                type='range'
                min={0}
                max={key === 'sustain' ? 1 : 2}
                step={0.01}
                value={value}
                onChange={(e) => handleEnvelopeChange(key, parseFloat(e.target.value))}
                className='w-full'
              />
              <span className='text-sm text-gray-500 w-12 text-right'>{value.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Oscillator Controls */}
      <div className={`space-y-4 ${activeTab === 'oscillator' ? 'block' : 'hidden'}`}>
        <div>
          <label className='setting-label'>Type</label>
          <select
            value={synthSettings.oscillator.type}
            onChange={(e) => handleOscillatorChange('type', e.target.value)}
            className='dropdown'>
            {['sine', 'square', 'sawtooth', 'triangle'].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='setting-label'>Detune</label>
          <div className='flex items-center space-x-2'>
            <input
              type='range'
              min={-100}
              max={100}
              value={synthSettings.oscillator.detune}
              onChange={(e) => handleOscillatorChange('detune', parseFloat(e.target.value))}
              className='w-full'
            />
            <span className='text-sm text-gray-500 w-16 text-right'>{synthSettings.oscillator.detune} cents</span>
          </div>
        </div>

        <div>
          <label className='setting-label'>Volume</label>
          <div className='flex items-center space-x-2'>
            <input
              type='range'
              min={-60}
              max={0}
              value={synthSettings.oscillator.volume}
              onChange={(e) => handleOscillatorChange('volume', parseFloat(e.target.value))}
              className='w-full'
            />
            <span className='text-sm text-gray-500 w-16 text-right'>{synthSettings.oscillator.volume} dB</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className={`space-y-4 ${activeTab === 'filter' ? 'block' : 'hidden'}`}>
        <div>
          <label className='setting-label'>Type</label>
          <select
            value={synthSettings.filter.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className='dropdown'>
            {['lowpass', 'highpass', 'bandpass'].map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='setting-label'>Frequency</label>
          <div className='flex items-center space-x-2'>
            <input
              type='range'
              min={20}
              max={20000}
              value={synthSettings.filter.frequency}
              onChange={(e) => handleFilterChange('frequency', parseFloat(e.target.value))}
              className='w-full'
            />
            <span className='text-sm text-gray-500 w-20 text-right'>{synthSettings.filter.frequency} Hz</span>
          </div>
        </div>

        <div>
          <label className='setting-label'>Q</label>
          <div className='flex items-center space-x-2'>
            <input
              type='range'
              min={0}
              max={10}
              step={0.1}
              value={synthSettings.filter.Q}
              onChange={(e) => handleFilterChange('Q', parseFloat(e.target.value))}
              className='w-full'
            />
            <span className='text-sm text-gray-500 w-16 text-right'>{synthSettings.filter.Q.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AudioSettingsForm

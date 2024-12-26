import React from 'react'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '../ui/Select'
import Slider from '../ui/Slider'
import { GenOscillatorSettings as OscillatorSettings } from '../../types'

interface OscillatorControlsProps {
  settings: OscillatorSettings
  onChange: (settings: OscillatorSettings) => void
}

const OscillatorControls: React.FC<OscillatorControlsProps> = ({ settings, onChange }) => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>Oscillator</h3>
      <div className='grid gap-4'>
        <label className='block'>
          <span className='text-sm'>Type</span>
          <Select
            value={settings.type}
            onValueChange={(value) => onChange({ ...settings, type: value as OscillatorSettings['type'] })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['sine', 'square', 'sawtooth', 'triangle'].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className='block'>
          <span className='text-sm'>Detune</span>
          <Slider
            value={[settings.detune]}
            min={-100}
            max={100}
            step={1}
            onValueChange={([value]) => onChange({ ...settings, detune: value })}
          />
        </label>
        <label className='block'>
          <span className='text-sm'>Volume</span>
          <Slider
            value={[settings.volume]}
            min={-60}
            max={0}
            step={1}
            onValueChange={([value]) => onChange({ ...settings, volume: value })}
          />
        </label>
      </div>
    </div>
  )
}

export default OscillatorControls

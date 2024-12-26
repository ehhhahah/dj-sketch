import React from 'react'
import Slider from '../ui/Slider'
import { GenADSRSettings as ADSRSettings } from '../../types'

interface EnvelopeControlsProps {
  adsr: ADSRSettings
  onChange: (settings: ADSRSettings) => void
}

const EnvelopeControls: React.FC<EnvelopeControlsProps> = ({ adsr, onChange }) => {
  const handleChange = (key: keyof ADSRSettings, value: number) => {
    onChange({ ...adsr, [key]: value })
  }

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>Envelope</h3>
      <div className='grid gap-4'>
        {Object.entries(adsr).map(([key, value]) => (
          <label key={key} className='block'>
            <span className='text-sm capitalize mb-1'>{key}</span>
            <Slider
              value={[value]}
              min={0}
              max={key === 'sustain' ? 1 : 2}
              step={0.01}
              onValueChange={([newValue]) => handleChange(key as keyof ADSRSettings, newValue)}
            />
          </label>
        ))}
      </div>
    </div>
  )
}

export default EnvelopeControls

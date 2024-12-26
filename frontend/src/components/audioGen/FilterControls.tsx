import React from 'react'
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '../ui/Select'
import Slider from '../ui/Slider'
import { GenFilterSettings as FilterSettings } from '../../types'

interface FilterControlsProps {
  settings: FilterSettings
  onChange: (settings: FilterSettings) => void
}

const FilterControls: React.FC<FilterControlsProps> = ({ settings, onChange }) => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>Filter</h3>
      <div className='grid gap-4'>
        <label className='block'>
          <span className='text-sm'>Type</span>
          <Select
            value={settings.type}
            onValueChange={(value) => onChange({ ...settings, type: value as FilterSettings['type'] })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['lowpass', 'highpass', 'bandpass'].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className='block'>
          <span className='text-sm'>Frequency</span>
          <Slider
            value={[settings.frequency]}
            min={20}
            max={20000}
            step={1}
            onValueChange={([value]) => onChange({ ...settings, frequency: value })}
          />
        </label>
        <label className='block'>
          <span className='text-sm'>Q</span>
          <Slider
            value={[settings.Q]}
            min={0}
            max={10}
            step={0.1}
            onValueChange={([value]) => onChange({ ...settings, Q: value })}
          />
        </label>
      </div>
    </div>
  )
}

export default FilterControls

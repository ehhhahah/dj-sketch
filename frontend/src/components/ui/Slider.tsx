import React from 'react'
import { SliderProps } from '../../types'

const Slider: React.FC<SliderProps> = ({ value, onValueChange, min, max, step }) => {
  return (
    <input
      type='range'
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      min={min}
      max={max}
      step={step}
      className='slider'
    />
  )
}

export default Slider

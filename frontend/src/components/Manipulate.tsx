import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import {
  AudioManipulationType,
  AUDIO_MANIPULATION_TYPES,
  AudioManipulationParameters
} from '../../../constants/audioManipulationTypes'
import ServerButton from './ServerButton'
import BaseModal from './BaseModal'
import { ManipulateProps } from '../types'
import { AudioManipulationSchema } from '../../../constants/serverSchemas'

const Manipulate: React.FC<ManipulateProps> = ({ id, isOpen, onRequestClose, getList }) => {
  const [loading, setLoading] = useState(false)
  const [manipulationType, setManipulationType] = useState<AudioManipulationType>('spectral_freeze')
  const [parameters, setParameters] = useState<Partial<AudioManipulationParameters>>({})

  const handleManipulate = async () => {
    try {
      setLoading(true)
      await axios.post<AudioManipulationSchema>(`http://127.0.0.1:8000/api/manipulate/process/${id}/`, {
        manipulation_type: manipulationType,
        parameters
      })
      toast.success('Upload manipulated successfully')
      await getList()
      onRequestClose()
    } catch (error) {
      toast.error('Error manipulating the upload', error)
    } finally {
      setLoading(false)
    }
  }

  const handleParameterChange = (param: string, value: number) => {
    setParameters((prev) => ({ ...prev, [param]: Number(value) }))
  }

  const renderParameters = () => {
    const selectedType = Object.values(AUDIO_MANIPULATION_TYPES).find((type) => type.type === manipulationType)

    if (!selectedType) {
      console.error('Invalid manipulation type', {
        manipulationType,
        manipulationTypes: AUDIO_MANIPULATION_TYPES
      })
      return null
    }

    return Object.entries(selectedType.parameters).map(([param, config]) => (
      <div key={param} className='space-y-2'>
        <label htmlFor={param} className='block text-sm font-medium'>
          {param.split('_').join(' ').toUpperCase()}
        </label>
        <p className='text-sm text-muted'>{config.description}</p>
        <input
          id={param}
          type='number'
          defaultValue={config.default}
          onChange={(e) => handleParameterChange(param, e.target.valueAsNumber)}
          className='input w-full number-input'
        />
      </div>
    ))
  }

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel='Manipulate Audio'>
      <div className='space-y-6'>
        <div>
          <label htmlFor='manipulation-type' className='block uppercase text-sm font-medium'>
            Manipulation Type
          </label>
          <select
            id='manipulation-type'
            value={manipulationType}
            onChange={(e) => setManipulationType(e.target.value as AudioManipulationType)}
            className='dropdown mt-2 w-full'>
            {Object.values(AUDIO_MANIPULATION_TYPES).map(({ type }) => (
              <option key={type} value={type}>
                {type.split('_').join(' ')}
              </option>
            ))}
          </select>
          <p className='text-sm text-muted mt-2'>
            {Object.values(AUDIO_MANIPULATION_TYPES).find((type) => type.type === manipulationType)?.description}
          </p>
        </div>
        <div className='space-y-4'>{renderParameters()}</div>
        <ServerButton title='Manipulate' onClick={handleManipulate} processing={loading} />{' '}
      </div>
    </BaseModal>
  )
}

export default Manipulate

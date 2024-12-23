import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import Modal from 'react-modal'
import { AudioManipulation } from '../types'
import ServerButton from './ServerButton'

interface ManipulateProps {
  id: number
  isOpen: boolean
  onRequestClose: () => void
  getList: () => void
}

const Manipulate: React.FC<ManipulateProps> = ({ id, isOpen, onRequestClose, getList }) => {
  const [loading, setLoading] = useState(false)
  const [manipulationType, setManipulationType] = useState<AudioManipulation['manipulation_type']>('spectral_freeze')
  const [parameters, setParameters] = useState<Record<string, any>>({})

  const handleManipulate = async () => {
    setLoading(true)

    try {
      await axios
        .post<AudioManipulation>(`http://127.0.0.1:8000/api/manipulate/process/${id}/`, {
          manipulation_type: manipulationType,
          parameters
        })
        .then(() => {
          toast.success('Upload manipulated successfully')
        })
      await getList()
    } catch (error) {
      toast.error('Error manipulating the upload', error)
    } finally {
      setLoading(false)
      onRequestClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel='Manipulate Audio'
      className='modal-content'
      overlayClassName='modal-overlay'>
      <div className='modal-header'>
        <h2 className='text-xl font-bold'>Manipulate Audio</h2>
        <button type='button' onClick={onRequestClose} className='modal-button-cancel'>
          x
        </button>
      </div>
      <form className='space-y-4'>
        <label className='block'>
          Manipulation Type:
          <select
            value={manipulationType}
            onChange={(e) => setManipulationType(e.target.value as AudioManipulation['manipulation_type'])}
            className='dropdown mt-2'>
            <option value='spectral_freeze'>Spectral Freeze</option>
            <option value='granular_synthesis'>Granular Synthesis</option>
            <option value='spectral_morphing'>Spectral Morphing</option>
            <option value='neural_style_transfer'>Neural Style Transfer</option>
          </select>
        </label>
        {/* Add more form fields for parameters as needed */}

        <ServerButton title='Manipulate' onClick={handleManipulate} processing={loading} />
      </form>
    </Modal>
  )
}

export default Manipulate
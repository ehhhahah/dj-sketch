import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { ListUploadsProps } from '../types'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { motion } from 'framer-motion'
import Manipulate from '../components/Manipulate'

const ListUploads: React.FC<ListUploadsProps> = ({ uploads, getList }) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [loading, setLoading] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    getList()
  }, [getList])

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this upload?')
    if (!confirmed) return

    try {
      await axios.delete(`http://127.0.0.1:8000/api/audio/${id}/`).then(() => {
        toast.success('Upload deleted successfully')
      })
      await getList()
    } catch (error) {
      toast.error('Error deleting the upload', error)
    }
  }

  const openManipulateModal = (id: number) => {
    setSelectedId(id)
    setModalOpen(true)
  }

  const closeManipulateModal = () => {
    setSelectedId(null)
    setModalOpen(false)
  }

  return (
    <div className='container'>
      <div className='menu-header' onClick={() => setExpanded(!expanded)}>
        <h1 className='section-title'>List of Uploads</h1>
        <button className='text-lg'>{expanded ? <MdExpandLess /> : <MdExpandMore />}</button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className='overflow-hidden'>
        <div className='space-y-4'>
          {uploads &&
            uploads.map((item, index) => (
              <div key={index} className='card text-center'>
                <p className='font-semibold'>{item.title ? item.title : item.file ? item.file.split('/').pop() : ''}</p>
                <p className='text-muted'>{item.style}</p>
                <audio controls className='audio'>
                  <source src={`http://127.0.0.1:8000/uploads/${item.file}`} type='audio/mpeg' />
                </audio>
                <div className='flex justify-center space-x-4'>
                  <button
                    className='button-danger'
                    onClick={async () => {
                      await handleDelete(item.id)
                    }}>
                    Delete
                  </button>
                  <button
                    className='button-manipulate'
                    onClick={() => openManipulateModal(item.id)}
                    disabled={loading === item.id}>
                    {loading === item.id ? 'Processing...' : 'Manipulate'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </motion.div>
      {selectedId !== null && (
        <Manipulate id={selectedId} isOpen={modalOpen} onRequestClose={closeManipulateModal} getList={getList} />
      )}
    </div>
  )
}

export default ListUploads

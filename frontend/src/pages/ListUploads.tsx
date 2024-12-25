import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { ListUploadsProps } from '../types'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { motion } from 'framer-motion'
import Manipulate from '../components/Manipulate'
import DetailsTable from '../components/DetailsTable'

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
        <h1 className='section-title'>
          <span>List</span> of uploads
        </h1>
        <button className='text-lg'>{expanded ? <MdExpandLess /> : <MdExpandMore />}</button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className='expanded-parent'>
        <div className='expanded-content'>
          {uploads &&
            uploads.map((item, index) => (
              <div key={index} className='card text-center'>
                <p className='font-semibold mb-2'>
                  {item.title ? item.title : item.file ? item.file.split('/').pop() : ''}
                </p>
                <DetailsTable item={item} />
                <audio controls className='audio mt-2'>
                  <source src={item.file} type='audio/mpeg' />
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

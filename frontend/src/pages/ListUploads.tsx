import React, { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { ListUploadsProps } from '../types'

const ListUploads: React.FC<ListUploadsProps> = ({ uploads, getList }) => {
  useEffect(() => {
    getList()
  }, [getList])

  return (
    <div className='max-w-xl mx-auto p-6 space-y-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>List of Uploads</h1>
      </div>
      <div className='space-y-4'>
        <div className='space-y-4'>
          {uploads &&
            uploads.map((item, index) => (
              <div key={index} className='border-2 border-dashed rounded-lg p-6 text-center'>
                <p className='text-lg font-bold mb-4'>
                  {item.title ? item.title : item.file ? item.file.split('/').pop() : ''}
                </p>
                <p className='text-zinc-600'>{item.style}</p>
                <audio controls>
                  <source src={`http://127.0.0.1:8000/uploads/${item.file}`} type='audio/mpeg' />
                </audio>
                <button
                  className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4'
                  onClick={async () => {
                    try {
                      await axios.delete('http://127.0.0.1:8000/api/audio/' + item.id + '/').then(() => {
                        toast.success('Upload deleted successfully')
                      })
                      await getList()
                    } catch (error) {
                      toast.error('Error deleting the upload', error)
                    }
                  }}>
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ListUploads

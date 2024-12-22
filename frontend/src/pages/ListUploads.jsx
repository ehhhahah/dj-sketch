import { useState } from 'react'
import { FaMusic as Music } from 'react-icons/fa'
import { toast } from 'sonner'

const ListUploads = () => {
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)

  const getList = async () => {
    setProcessing(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/audio/')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setResult(data)
    } catch (error) {
      toast.error(
        <div className='flex items-center'>
          <Music className='w-6 h-6 mr-2' />
          <span className='font-bold mr-2'>Error retrieving audios</span>
          <span className='ml-auto text-sm text-zinc-400'>{error.message}</span>
        </div>
      )
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className='max-w-xl mx-auto p-6 space-y-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4'>List of Uploads</h1>
      </div>
      <div className='space-y-4'>
        <button onClick={getList} className='bg-zinc-500 hover:bg-zinc-600 text-white font-bold py-2 px-4 rounded'>
          {processing ? 'Loading...' : 'List Uploads'}
        </button>
        <div className='space-y-4'>
          {result &&
            result.map((item, index) => (
              <div key={index} className='border-2 border-dashed rounded-lg p-6 text-center'>
                <p className='text-lg font-bold mb-4'>
                  {item.title ? item.title : item.file ? item.file.split('/').pop() : ''}
                </p>
                <p className='text-zinc-600'>{item.style}</p>
                <audio controls>
                  <source src={'http://127.0.0.1:8000/api/' + item.file} type='audio/mpeg' />
                </audio>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ListUploads

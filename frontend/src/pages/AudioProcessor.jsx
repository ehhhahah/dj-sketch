import { useState } from 'react'
import { FaUpload as Upload, FaMusic as Music } from 'react-icons/fa'
import { toast } from 'sonner'

const AudioProcessor = () => {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [selectedStyle, setSelectedStyle] = useState('classical')

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0]
    if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
      setFile(uploadedFile)
    }
  }

  const processAudio = async () => {
    if (!file) return

    setProcessing(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('style', selectedStyle)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/audio/', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.processed_file)
    } catch (error) {
      toast.error(
        <div className='flex items-center'>
          <Music className='w-6 h-6 mr-2' />
          <span className='font-bold mr-2'>Error processing audio</span>
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
        <h1 className='text-2xl font-bold mb-4'>Neural Music Style Transfer</h1>
        <p className='text-zinc-600'>Transform your music into different styles using AI</p>
      </div>

      <div className='space-y-4'>
        <div className='border-2 border-dashed rounded-lg p-6 text-center'>
          <input type='file' accept='audio/*' onChange={handleFileUpload} className='hidden' id='audio-upload' />
          <label htmlFor='audio-upload' className='flex flex-col items-center cursor-pointer'>
            <Upload className='w-12 h-12  text-zinc-400' />
            <span className='mt-2 text-sm text-zinc-400'>{file ? file.name : 'Upload your audio file'}</span>
          </label>
        </div>

        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className='w-full p-2 border rounded'>
          <option value='classical'>Classical</option>
          <option value='jazz'>Jazz</option>
          <option value='rock'>Rock</option>
        </select>

        <button
          onClick={processAudio}
          disabled={!file || processing}
          className='w-full bg-zinc-950 text-zinc-100 p-3 rounded-lg disabled:opacity-50'>
          {processing ? 'Processing...' : 'Transform Audio'}
        </button>
      </div>

      {result &&
        toast.success(
          <div className='flex items-center'>
            <Music className='w-6 h-6 mr-2' />
            <span>Audio processed successfully!</span>
          </div>
        )}
    </div>
  )
}

export default AudioProcessor

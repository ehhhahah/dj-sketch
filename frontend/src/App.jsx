// import { useState } from 'react'
import AudioProcessor from './pages/AudioProcessor'
import { Toaster } from 'sonner'
import ListUploads from './pages/ListUploads'

function App() {
  return (
    <>
      <Toaster position='top-right' />
      <AudioProcessor />
      <ListUploads />
    </>
  )
}

export default App

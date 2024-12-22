// import { useState } from 'react'
import AudioProcessor from './pages/AudioProcessor'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Toaster position='top-right' />
      <AudioProcessor />
    </>
  )
}

export default App

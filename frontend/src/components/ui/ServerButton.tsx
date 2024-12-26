import { motion } from 'framer-motion'
import React from 'react'
import { ServerButtonProps } from '../../types'

const ServerButton: React.FC<ServerButtonProps> = ({ title, onClick, processing }) => {
  // This component is a button that can be disabled and that sends data to server
  return (
    <motion.button
      whileHover={{ scale: processing ? 1 : 0.9 }}
      whileTap={{ scale: processing ? 1 : 0.9 }}
      transition={{ type: 'spring' }}
      className={`button-full ${processing ? 'loading cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={processing}>
      {title}
    </motion.button>
  )
}

export default ServerButton

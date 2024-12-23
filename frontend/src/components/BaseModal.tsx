import React from 'react'
import Modal from 'react-modal'
import { motion } from 'framer-motion'
import { BaseModalProps } from '../types'

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onRequestClose, contentLabel, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className='modal-content'
      overlayClassName='modal-overlay'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}>
        <div className='modal-header'>
          <h2 className='text-xl font-bold'>{contentLabel}</h2>
          <button type='button' onClick={onRequestClose} className='modal-button-cancel'>
            x
          </button>
        </div>
        {children}
      </motion.div>
    </Modal>
  )
}

export default BaseModal

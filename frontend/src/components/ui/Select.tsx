import React from 'react'

const Select = ({ value, onValueChange, children }) => {
  return <div className='select'>{children}</div>
}

const SelectContent = ({ children }) => {
  return <div className='select-content'>{children}</div>
}

const SelectItem = ({ value, children }) => {
  return <div className='select-item'>{children}</div>
}

const SelectTrigger = ({ children }) => {
  return <div className='select-trigger'>{children}</div>
}

const SelectValue = () => {
  return <div className='select-value'></div>
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }

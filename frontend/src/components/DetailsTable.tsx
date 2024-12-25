import React from 'react'
import { AudioUploadSchema } from '../../../constants/serverSchemas'
import { relativeDate } from '../utils/relativeDate'

interface DetailsTableProps {
  item: AudioUploadSchema
}

const isLink = (value: string) => {
  try {
    new URL(value)
    return true
  } catch (_) {
    return false
  }
}

const DetailsTable: React.FC<DetailsTableProps> = ({ item }) => {
  const filteredEntries = Object.entries(item).filter(([_, value]) => value !== null && value !== '')

  return (
    <table className='audio-details-table'>
      <tbody>
        <tr className='table-header'>
          {filteredEntries.map(([key]) => (
            <th key={key}>{key.replace('_', ' ')}</th>
          ))}
        </tr>
        <tr>
          {filteredEntries.map(([key, value]) => (
            <td key={key} title={value}>
              {isLink(value) ? (
                <a href={value} target='_blank' rel='noopener noreferrer' className='underline'>
                  {value}
                </a>
              ) : (
                relativeDate(value)
              )}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default DetailsTable

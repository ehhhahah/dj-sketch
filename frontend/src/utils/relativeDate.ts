import { formatDistanceToNow } from 'date-fns'

const isDate = (value: string, key?: string) => {
  if (key === 'created_at') {
    return true
  }
  if (key === 'id' || key === 'made_from') {
    return false
  }

  return !isNaN(Date.parse(value))
}

/**
 * Converts a date string to a relative date string (e.g., "5 minutes ago").
 *
 * @param value - The date string to convert.
 * @param key - An optional key to provide context for the value.
 * @returns The relative date string if the value is a date, otherwise the original value.
 */
export const relativeDate = (value: string, key?: string) => {
  return isDate(value, key) ? formatDistanceToNow(new Date(value), { addSuffix: true }) : value
}

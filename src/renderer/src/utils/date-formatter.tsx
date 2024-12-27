import Negative from '@/components/negative'

export function formatDate(isoDate: string): string | JSX.Element {
  const date = new Date(isoDate)

  // Define options for the readable date format
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }

  const formattedDate = date.toLocaleDateString('en-GB', options)
  if (formattedDate === 'Invalid Date') return <Negative />

  return formattedDate
}

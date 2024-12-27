export const calculateDateInterval = (startDateChar: string, endDateChar: string): string => {
  const startDate = new Date(startDateChar)
  const endDate = new Date(endDateChar)
  const estimatedTime = endDate.getTime() - startDate.getTime()

  let displayEstimatedTime: string = ''
  if (estimatedTime < 0) {
    displayEstimatedTime = '-'
  } else {
    // Calculate total days and total hours
    const totalDays =
      Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 // Add 1 to include the end date
    const totalHours = Math.floor((estimatedTime / (1000 * 60 * 60)) % 24) // Remaining hours after days

    // Construct display string
    if (totalDays > 0) {
      displayEstimatedTime = totalDays + ' ' + (totalDays === 1 ? 'day' : 'days')
    } else if (totalHours > 0) {
      displayEstimatedTime = totalHours + ' ' + (totalHours === 1 ? 'hour' : 'hours')
    } else {
      displayEstimatedTime = '0 hours' // If no time difference
    }
  }

  return displayEstimatedTime
}

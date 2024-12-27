import Negative from '@/components/negative'

const calculateDaysFromHours = (hours: string, isAi: boolean | undefined) => {
  if (isAi && isAi === true) {
    const result =
      parseFloat(hours) > 1
        ? `${parseFloat(hours).toFixed(0)} days`
        : `${parseFloat(hours).toFixed(0)} day`

    if (result.includes('NaN')) {
      return <Negative className="bg-transparent" />
    } else return result
  } else if (parseFloat(hours) !== 0) {
    const result =
      parseFloat(hours) / 24 > 1
        ? `${(parseFloat(hours) / 24).toFixed(0)} days`
        : `${(parseFloat(hours) / 24).toFixed(1)} day`
    if (result.includes('NaN')) {
      return <Negative className="bg-transparent" />
    } else return result
  } else {
    return <Negative className="bg-transparent" />
  }
}
export default calculateDaysFromHours

import Negative from '@/components/negative'

const calculateDisplayTime = (time: string) => {
  if (time.includes('day')) {
    const result =
      parseFloat(time.replace('day', '')) +
      (parseFloat(time.replace('day', '')) === 1 ? ' day' : ' days')

    if (result.includes('NaN')) {
      return <Negative />
    } else return result
  } else {
    const result = parseFloat(time) + (parseFloat(time) === 1 ? ' hour' : ' hours')
    if (result.includes('NaN')) {
      return <Negative />
    } else return result
  }
}

export default calculateDisplayTime

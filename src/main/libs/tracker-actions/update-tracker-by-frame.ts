import { trackerStore } from '../../store'

export function updateFrame(
  time: number,
  keystrokes: number,
  mouseClicks: number,
  randomIntervalCounter: number,
  windowsWithTimeSpend: string
) {
  trackerStore.set('globalTime', time)
  trackerStore.set('trackerKeystrokesNumber', keystrokes)
  trackerStore.set('trackerMouseClicksNumber', mouseClicks)
  trackerStore.set('frameTime', randomIntervalCounter)
  trackerStore.set('windowsWithTimeSpend', windowsWithTimeSpend)
}

export async function getCurrentFrame() {
  const frame = (await trackerStore.get('frameTime')) as number
  const keys = (await trackerStore.get('trackerKeystrokesNumber')) as number
  const clicks = (await trackerStore.get('trackerMouseClicksNumber')) as number
  const applications_data = (await trackerStore.get('windowsWithTimeSpend')) as string
  const startDate = (await trackerStore.get('startDate')) as string
  const globalTime = (await trackerStore.get('globalTime')) as number
  const screenshot = (await trackerStore.get('screenshot')) as string
  const img = Buffer.from(screenshot, 'base64')

  return {
    frame,
    keys,
    clicks,
    applications_data,
    startDate,
    img,
    globalTime
  }
}

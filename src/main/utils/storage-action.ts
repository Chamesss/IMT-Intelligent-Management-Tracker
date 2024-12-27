import { Notification } from 'electron'
import api from '../libs/axios-interceptor'
import retryRequest from '../libs/retry-request'
import { pauseTrackerState } from '../libs/tracker-actions'
import { trackerStore } from '../store'
import log from './logger'

interface TrackerArrayCache {
  screenshot: string
  frame: number
  trackerKeystrokesNumber: number
  trackerMouseClicksNumber: number
  urlData: string
  applications_data: string
  endDate: string
  startDate: string
}

export async function processCache() {
  const cachedData = ((await trackerStore.get('cache')) as Array<TrackerArrayCache>) || []

  if (cachedData.length > 0) {
    let i = 0
    cachedData.forEach(async (cachedEntry) => {
      i++
      try {
        const screenshot = Buffer.from(cachedEntry.screenshot, 'base64')
        log.info(`processing cached entry ${i} of ${cachedData.length}:`)
        const formData = new FormData()
        formData.append('file', new Blob([screenshot]))
        formData.append('time', cachedEntry.frame.toString())
        formData.append('keystrokes', cachedEntry.trackerKeystrokesNumber.toString())
        formData.append('clicks', cachedEntry.trackerMouseClicksNumber.toString())
        formData.append('urlData', cachedEntry.urlData.toString())
        formData.append('applications_data', cachedEntry.applications_data)
        formData.append('endDate', cachedEntry.endDate)
        formData.append('startDate', cachedEntry.startDate.toString())

        try {
          await retryRequest(api, formData)
          trackerStore.set('cache', [])
        } catch (error) {
          log.warn('Error processing cache:', error)
          return
        }
      } catch (error) {
        log.warn('Error processing cache from storage:', error)
        return
      }
    })
  }
}

export async function saveToCache(
  screenshot: Buffer,
  frame: number,
  keys: number,
  clicks: number,
  urlData: string,
  applications_data: string,
  endDate: string,
  startDate: string,
  event?: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent
) {
  const currentCache = ((await trackerStore.get('cache')) as Array<TrackerArrayCache>) || []
  const base64Screenshot = screenshot.toString('base64')
  const trackerData = {
    screenshot: base64Screenshot,
    frame,
    trackerKeystrokesNumber: keys,
    trackerMouseClicksNumber: clicks,
    urlData,
    applications_data,
    endDate,
    startDate
  }

  currentCache.push(trackerData)
  trackerStore.set('cache', currentCache)

  let totalDurationInSeconds = 0
  const oneHourInSeconds = 3600

  for (const cachedFrame of currentCache) {
    const frameStartDate = new Date(cachedFrame.startDate).getTime()
    const frameEndDate = new Date(cachedFrame.endDate).getTime()

    const frameDurationInSeconds = (frameEndDate - frameStartDate) / 1000
    totalDurationInSeconds += frameDurationInSeconds

    if (totalDurationInSeconds >= oneHourInSeconds) {
      event && event.sender.send('killTracker', true)
      pauseTrackerState()
      new Notification({
        title: 'Tracker stopped',
        body: 'You have been offline more then one hour, check your network.'
      }).show()
      break
    }
  }
}

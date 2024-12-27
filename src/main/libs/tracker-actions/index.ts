import { Notification } from 'electron'
import ElectronStore from 'electron-store'
import getUrlsTracked from '../../libs/url-tracking'
import { trackerStore, userStore } from '../../store'
import { BrowserHistoryResult } from '../../types'
import { customInterval } from '../../utils/custom-interval'
import log from '../../utils/logger'
import { getActiveWin, stopActiveWinListener } from '../get-active-win'
import { createKeyListener, forceStopListener } from '../keyboard-listener'
import captureScreen from '../screenshot'
import { postFrameOnHandle } from '../update-req-on/post-frame'
import { clearIntervalId } from './clear-interval'
import { getCurrentFrame, updateFrame } from './update-tracker-by-frame'

export let intervalId: {
  stop: () => void
} | null = null

export async function startTracker(
  randomInterval: number,
  event: Electron.IpcMainInvokeEvent | Electron.IpcMainEvent
) {
  try {
    clearIntervalId(intervalId)
    resetTrackerState(trackerStore)
    const tracker = { keystrokes: 0, mouseClicks: 0 }
    let randomIntervalCounter = 0
    let windowsWithTimeSpend = []
    let GlobalTime = 0
    let startDate = new Date().toISOString()
    trackerStore.set('startDate', startDate)
    createKeyListener(tracker).startListener()
    await getActiveWin(windowsWithTimeSpend)
    intervalId = customInterval(() => {
      if (randomInterval === randomIntervalCounter) {
        const oldStartDate = startDate
        startDate = new Date().toISOString()
        trackerStore.set('startDate', startDate)
        const frame = randomIntervalCounter
        randomIntervalCounter = 0
        const keys = tracker.keystrokes
        const clicks = tracker.mouseClicks
        const applications_data = JSON.stringify(windowsWithTimeSpend)
        tracker.keystrokes = 0
        tracker.mouseClicks = 0
        windowsWithTimeSpend = []
        setTimeout(async () => {
          try {
            const screenshot: Buffer | boolean = await captureScreen()
            if (typeof screenshot === 'boolean') {
              new Notification({
                title: 'Capture Screen - Error encountered',
                body: 'Error capturing screen, please try again'
              }).show()
              return
            }

            await getActiveWin(windowsWithTimeSpend)
            const urlData = JSON.stringify(
              ((await getUrlsTracked(Math.round(frame / 60))) as BrowserHistoryResult[]).flat()
            )
            await postFrameOnHandle(
              screenshot,
              frame,
              keys,
              clicks,
              urlData,
              applications_data,
              oldStartDate,
              tracker,
              event
            )
          } catch (e) {
            log.warn('Error posting frame on Timeout - Start:', e)
          }
        }, 0)
      }

      randomIntervalCounter++
      GlobalTime++
      updateFrame(
        GlobalTime,
        tracker.keystrokes,
        tracker.mouseClicks,
        randomIntervalCounter,
        JSON.stringify(windowsWithTimeSpend)
      )
      event.sender.send('updateTime', GlobalTime)
    }, 1000)
  } catch (e) {
    pauseTrackerState()
    event.sender.send('killTracker', true)
  }
}

export async function pauseTracker(event?: Electron.IpcMainInvokeEvent | Electron.IpcMainEvent) {
  try {
    const { frame, keys, clicks, applications_data, startDate } = await getCurrentFrame()
    let GlobalTime = (await trackerStore.get('globalTime')) as number
    const tracker = { keystrokes: keys, mouseClicks: clicks }
    pauseTrackerState()
    createKeyListener(tracker).stopListener()
    if (frame.toString() === '0') return GlobalTime
    setTimeout(async () => {
      try {
        const screenshot: Buffer | boolean = await captureScreen()
        if (typeof screenshot === 'boolean') {
          new Notification({
            title: 'Capture Screen - Error encountered',
            body: 'Error capturing screen, please try again'
          }).show()
          return
        }
        const urlData = JSON.stringify(
          ((await getUrlsTracked(Math.round(Number(frame) / 60))) as BrowserHistoryResult[]).flat()
        )
        await postFrameOnHandle(
          screenshot,
          frame,
          keys,
          clicks,
          urlData,
          applications_data,
          startDate,
          tracker,
          event
        ).finally(() => resetTrackerValues(trackerStore))
      } catch (e) {
        log.warn('Error pausing tracker on Timeout:', e)
      }
    }, 0)
    return GlobalTime
  } catch (e) {
    log.warn('Error pausing tracker on pauseTracker:', e)
    return null
  }
}

export async function resumeTracker(
  randomInterval: number,
  event: Electron.IpcMainInvokeEvent | Electron.IpcMainEvent
) {
  try {
    pauseTrackerState()
    const prevValues = await getCurrentFrame()
    let startDate = new Date().toISOString()
    trackerStore.set('startDate', startDate)
    let GlobalTime = (await trackerStore.get('globalTime')) as number
    const tracker = { keystrokes: prevValues.keys || 0, mouseClicks: prevValues.clicks || 0 }
    let windowsWithTimeSpend = JSON.parse(prevValues.applications_data || '[]')
    let randomIntervalCounter = prevValues.frame || 0
    createKeyListener(tracker).startListener()
    await getActiveWin(windowsWithTimeSpend)
    intervalId = customInterval(() => {
      if (randomInterval === randomIntervalCounter) {
        const frame = randomIntervalCounter
        const keys = tracker.keystrokes
        const clicks = tracker.mouseClicks
        const applications_data = JSON.stringify(windowsWithTimeSpend)
        const oldStartDate = startDate
        randomIntervalCounter = 0
        tracker.keystrokes = 0
        tracker.mouseClicks = 0
        windowsWithTimeSpend = []
        startDate = new Date().toISOString()
        trackerStore.set('startDate', new Date().toISOString())
        setTimeout(async () => {
          try {
            const screenshot: Buffer | boolean = await captureScreen()
            if (typeof screenshot === 'boolean') {
              new Notification({
                title: 'Capture Screen - Error encountered',
                body: 'Error capturing screen, please try again'
              }).show()
              return
            }

            await getActiveWin(windowsWithTimeSpend)
            const urlData = JSON.stringify(
              ((await getUrlsTracked(Math.round(frame / 60))) as BrowserHistoryResult[]).flat()
            )
            await postFrameOnHandle(
              screenshot,
              frame,
              keys,
              clicks,
              urlData,
              applications_data,
              oldStartDate,
              tracker,
              event
            )
          } catch (e) {
            log.warn('Error posting frame on Timeout - Start:', e)
          }
        }, 0)
      }
      randomIntervalCounter++
      GlobalTime++
      updateFrame(
        GlobalTime,
        tracker.keystrokes,
        tracker.mouseClicks,
        randomIntervalCounter,
        JSON.stringify(windowsWithTimeSpend)
      )
      event.sender.send('updateTime', GlobalTime)
    }, 1000)
  } catch (e) {
    pauseTrackerState()
    event.sender.send('killTracker', true)
  }
}

export async function stopTracker(event: Electron.IpcMainInvokeEvent | Electron.IpcMainEvent) {
  try {
    const { frame, keys, clicks, applications_data, startDate } = await getCurrentFrame()
    const tracker = { keystrokes: keys, mouseClicks: clicks }
    pauseTrackerState()
    createKeyListener(tracker).stopListener()
    if (frame.toString() !== '0') {
      setTimeout(async () => {
        try {
          const screenshot: Buffer | boolean = await captureScreen()
          if (typeof screenshot === 'boolean') {
            new Notification({
              title: 'Capture Screen - Error encountered',
              body: 'Error capturing screen, please try again'
            }).show()
            return
          }
          const urlData = JSON.stringify(
            (
              (await getUrlsTracked(Math.round(Number(frame) / 60))) as BrowserHistoryResult[]
            ).flat()
          )

          await postFrameOnHandle(
            screenshot,
            frame,
            keys,
            clicks,
            urlData,
            applications_data,
            startDate,
            tracker,
            event
          ).finally(() => resetTrackerState(trackerStore))
        } catch (e) {
          log.warn('Error stopping tracker onTimeout')
        }
      }, 0)
    } else resetTrackerState(trackerStore)
    let GlobalTime = 0
    return GlobalTime
  } catch (e) {
    log.warn('Error stop tracker on stopTracker:', e)
    new Notification({ title: 'Tracker - Stop Error', body: JSON.stringify(e) }).show()
    return null
  }
}

export function resetTrackerValues(trackerStore: ElectronStore<Record<string, unknown>>): void {
  trackerStore.set('trackerKeystrokesNumber', 0)
  trackerStore.set('trackerMouseClicksNumber', 0)
  trackerStore.set('frameTime', 0)
  trackerStore.set('startDate', '')
  trackerStore.set('windowsWithTimeSpend', '')
  trackerStore.set('trackerScreenshots', '')
  trackerStore.set('urls', '')
}

export function resetTrackerState(trackerStore: ElectronStore<Record<string, unknown>>): void {
  resetTrackerValues(trackerStore)
  trackerStore.set('globalTime', 0)
}

export function resetUserState(userStore: ElectronStore<Record<string, unknown>>): void {
  userStore.set('userId', '')
  userStore.set('accessToken', '')
  userStore.set('refreshToken', '')
}

export function clearElectronState(tracker?: { mouseClicks: number; keystrokes: number }): void {
  resetUserState(userStore)
  resetTrackerState(trackerStore)
  stopListeners(tracker)
}

export function clearTrackerState(tracker: { mouseClicks: number; keystrokes: number }): void {
  resetTrackerState(trackerStore)
  stopListeners(tracker)
}

export function pauseTrackerState(tracker?: { mouseClicks: number; keystrokes: number }): void {
  stopListeners(tracker)
}

function stopListeners(tracker?: { mouseClicks: number; keystrokes: number }) {
  clearIntervalId(intervalId)
  if (!tracker) {
    forceStopListener()
  } else createKeyListener(tracker).stopListener()
  stopActiveWinListener()
}

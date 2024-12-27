import { ElectronAPI } from '@electron-toolkit/preload'
import { IpcRendererEvent } from 'electron/renderer'

interface AuthProps {
  userId: string | null
  accessToken: string | null
  refreshToken: string | null
}

interface downloadProps {
  url: string
  properties: {
    directory: string
  }
}

interface trackerState {
  trackerId: string
  globalTime: number
  trackerKeystrokesNumber: number
  trackerMouseClicksNumber: number
  trackerScreenshots: Array<string>
  frameTime: number
  startDate: string
}

interface API {
  setUser: (data: AuthProps) => Promise<boolean>
  getUser: () => Promise<void>
  getTrackerState: () => Promise<trackerState>
  downloadFile: (data: downloadProps) => Promise<void>

  urlTracking: () => Promise<void>

  startTracker: () => Promise<void>
  pauseTracker: () => Promise<number>
  resumeTracker: () => Promise<void>
  stopTracker: () => Promise<number>
  resetTracker: () => Promise<void>

  disconnectInternet: () => Promise<void>
  connectInternet: () => Promise<void>

  onUpdateTime: (callback: (value: number) => void) => () => void
  onTrackerResumed: (callback: (value: number) => void) => () => void
  onTrackUrls: (callback: (value: BrowserHistoryResult[][]) => void) => () => void

  sendNotification: (title: string, body: string) => void

  //auth operations
  onLogoutRenderer: (callback: () => void) => () => void // listen to renderer
  logoutMain: () => void // send to main
  login: (accessToken: string, accessToken: string, userId: string) => void // send to main
  updateAccessTokenMain: (accessToken: string) => void // send to main
  onUpdateAccessTokenRenderer: (callback: (accessToken: string) => void) => void // listen to renderer

  onSystemAwake: (callback: () => void) => () => void
  onTrackingMode: (callback: () => void) => () => void

  onPauseTracker: (callback: () => void) => () => void
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

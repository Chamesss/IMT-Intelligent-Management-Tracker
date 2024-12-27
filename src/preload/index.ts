import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { BrowserHistoryResult } from '../main/types'

export interface AuthProps {
  userId: string | null
  accessToken: string | null
  refreshToken: string | null
}

export interface downloadProps {
  url: string
  properties: {
    directory: string
  }
}

// Custom APIs for renderer
const api = {
  setUser: (data: AuthProps) => ipcRenderer.invoke('setUser', data),
  getUser: () => ipcRenderer.invoke('getUser'),
  getTrackerState: () => ipcRenderer.invoke('getTrackerState'),
  downloadFile: (data: downloadProps) => ipcRenderer.send('downloadFile', data),

  urlTracking: () => ipcRenderer.send('urlTracking'),

  startTracker: () => ipcRenderer.send('startTracker'),
  pauseTracker: () => ipcRenderer.invoke('pauseTracker'),
  resumeTracker: () => ipcRenderer.send('resumeTracker'),
  stopTracker: () => ipcRenderer.invoke('stopTracker'),
  resetTracker: () => ipcRenderer.send('resetTracker'),

  disconnectInternet: () => ipcRenderer.send('disconnectConnection'),
  connectInternet: () => ipcRenderer.send('connectConnection'),

  onUpdateTime: (callback: (value: number) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, value: number) => callback(value)
    ipcRenderer.on('updateTime', listener)
    return () => {
      ipcRenderer.removeListener('updateTime', listener)
    }
  },

  onTrackerResumed: (callback: (value: number) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, value: number) => callback(value)
    ipcRenderer.on('updateTime', listener)
    return () => {
      ipcRenderer.removeListener('updateTime', listener)
    }
  },

  onRetrieveNewTokens: (callback: () => void) => {
    const listener = (_event: Electron.IpcRendererEvent) => callback()
    ipcRenderer.on('retrieveNewTokens', listener)
    return () => {
      ipcRenderer.removeListener('retrieveNewTokens', listener)
    }
  },

  onTrackUrls: (callback: (value: BrowserHistoryResult) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, value: BrowserHistoryResult) =>
      callback(value)
    ipcRenderer.on('trackUrls', listener)
    return () => {
      ipcRenderer.removeListener('trackUrls', listener)
    }
  },

  sendNotification: (title: string, body: string) => ipcRenderer.send('notify', { title, body }),

  // auth operations
  onLogoutRenderer: (callback: () => void) => {
    const listener = () => callback()
    ipcRenderer.on('logout', listener)
    return () => {
      ipcRenderer.removeListener('logout', listener)
    }
  },

  logoutMain: () => ipcRenderer.send('logout'),
  login: (accessToken: string, refreshToken: string, userId: string) =>
    ipcRenderer.send('login', { accessToken, refreshToken, userId }),
  updateAccessTokenMain: (accessToken: string) =>
    ipcRenderer.send('updateAccessToken', accessToken),
  // onUpdateAccessTokenRenderer: (callback: (accessToken: string) => void) => {
  //   const listener = (_event: Electron.IpcRendererEvent, accessToken: string) =>
  //     callback(accessToken)
  //   ipcRenderer.on('updateAccessToken', listener)
  //   return () => {
  //     ipcRenderer.removeListener('updateAccessToken', listener)
  //   }
  // }

  onUpdateAccessTokenRenderer: (callback: (arg0: any) => void) =>
    ipcRenderer.on('updateAccessToken', (_event, value) => callback(value)),

  onSystemAwake: (callback: () => void) => {
    const listener = () => callback()
    ipcRenderer.on('systemAwake', listener)
    return () => {
      ipcRenderer.removeListener('systemAwake', listener)
    }
  },

  onPauseTracker: (callback: (arg0: boolean) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, value: boolean) => callback(value)
    ipcRenderer.on('killTracker', listener)
    return () => {
      ipcRenderer.removeListener('killTracker', listener)
    }
  },

  onTrackingMode: (callback: () => void) => {
    const listener = () => callback()
    ipcRenderer.on('inTrackingMode', listener)
    return () => {
      ipcRenderer.removeListener('inTrackingMode', listener)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api as API
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  nativeImage,
  Notification,
  powerMonitor,
  screen,
  shell,
  Tray
} from 'electron'
import os from 'os'
import path, { join } from 'path'
import appIcon from '../../build/icon.ico?asset'
import icon from '../../build/icon.png?asset'
import { AuthProps, downloadProps } from '../preload'
import { setupAxiosInterceptors } from './libs/axios-interceptor'
import {
  clearElectronState,
  pauseTracker,
  resetTrackerState,
  resumeTracker,
  startTracker,
  stopTracker
} from './libs/tracker-actions'

import { trackerStore, userStore } from './store'
import log from './utils/logger'

let randomInterval = 900
let mainWindow: BrowserWindow

log.info('Starting...')

function createWindow(): void {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    setupAxiosInterceptors(mainWindow)
  })

  mainWindow.on('minimize', function (event) {
    event.preventDefault()
    // mainWindow.hide()

    // let minimizedWindow = new BrowserWindow({
    //   width: 400,
    //   height: 300,
    //   autoHideMenuBar: true,
    //   webPreferences: {
    //     nodeIntegration: true
    //   }
    // })

    // minimizedWindow.loadURL(
    //   `file://${path.join(__dirname, '../renderer/index.html')}?component=my-component&userId=123`
    // )

    // minimizedWindow.show()

    // minimizedWindow.on('closed', () => {
    //   minimizedWindow.destroy()
    // })

    mainWindow.on('restore', function () {
      // mainWindow.show()
      // minimizedWindow.destroy()
    })
  })

  // let tray = new Tray(nativeImage.createFromPath(appIcon))

  // const contextMenu = Menu.buildFromTemplate([
  //   {
  //     label: 'Show App',
  //     click: function () {
  //       mainWindow.show()
  //     }
  //   },
  //   {
  //     label: 'Quit',
  //     click: function () {
  //       app.quit()
  //     }
  //   }
  // ])

  // tray.setToolTip('Intelligent Management Tracker')
  // tray.setContextMenu(contextMenu)

  // Handle tray icon click to show the window
  // tray.on('click', function () {
  //   mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  // })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('close', (event) => {
    // Prevent default close behavior and show a confirmation dialog
    event.preventDefault()
    pauseTracker()
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: 'Are you sure you want to quit?'
    })

    if (choice === 0) {
      // User chose 'Yes'
      mainWindow.destroy() // Close the window and quit the app
    }
  })

  powerMonitor.on('resume', () => {
    log.info('The system is going to wake up')
    mainWindow.webContents.send('systemAwake')
    // if (intervalId) {
    //   mainWindow.webContents.send('inTrackingMode')
    // }
  })

  powerMonitor.on('suspend', () => {
    log.info('The system is going to sleep')
    pauseTracker()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.disableHardwareAcceleration()
app.commandLine.appendSwitch('force_high_performance_gpu', 'true') // Use integrated GPU

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  console.log('quitting :)')
  app.quit()
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // If the main window exists, focus it
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('updateAccessToken', (_, accessToken: string) => {
    userStore.set('accessToken', accessToken)
  })

  ipcMain.on('logout', () => clearElectronState())

  ipcMain.on('downloadFile', async (_, data: downloadProps) => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      ;(async () => {
        try {
          const electronDl = await import('electron-dl')
          electronDl.default()
          const username = os.userInfo().username
          if (process.platform === 'linux') {
            data.properties.directory = `/home/${username}/${data.properties.directory}`
          } else if (process.platform === 'win32') {
            data.properties.directory = `C:\\Users\\${username}\\${data.properties.directory}`
          } else if (process.platform === 'darwin') {
            data.properties.directory = `/Users/${username}/${data.properties.directory}`
          }
          electronDl.download(focusedWindow, data.url, data.properties).then((dl) =>
            new Notification({
              title: `File downloaded`,
              body: `${dl.getSavePath()}`
            }).show()
          )
        } catch (e) {
          console.log(e)
        }
      })()
    }
  })

  ipcMain.handle('setUser', async (_, data: AuthProps) => {
    userStore.set('userId', data.userId)
    userStore.set('accessToken', data.accessToken)
    userStore.set('refreshToken', data.refreshToken)
    return true
  })

  ipcMain.handle('getUser', () => {
    const userId = userStore.get('userId') as string
    const accessToken = userStore.get('accessToken') as string
    const refreshToken = userStore.get('refreshToken') as string
    return { userId, accessToken, refreshToken }
  })

  //start tracking
  ipcMain.on('startTracker', async (event: Electron.IpcMainEvent) => {
    startTracker(randomInterval, event)
  })

  //pause tracking
  ipcMain.handle('pauseTracker', async (event: Electron.IpcMainInvokeEvent) => {
    const globalTime: number | null = await pauseTracker(event)
    return globalTime
  })

  //resume tracking
  ipcMain.on('resumeTracker', async (event: Electron.IpcMainEvent) => {
    resumeTracker(randomInterval, event)
  })

  //reset trackings
  ipcMain.handle('stopTracker', async (event: Electron.IpcMainInvokeEvent) => {
    const globalTime: number | null = await stopTracker(event)
    return globalTime
  })

  ipcMain.handle('getTrackerState', async () => {
    let globalTime = trackerStore.get('globalTime') as number
    let trackerKeystrokesNumber = trackerStore.get('trackerKeystrokesNumber') as number
    let trackerMouseClicksNumber = trackerStore.get('trackerMouseClicksNumber') as number
    let trackerScreenshots = trackerStore.get('trackerScreenshots') as string[]
    let frameTime = trackerStore.get('frameTime') as number
    let startDate = trackerStore.get('startDate') as string
    return {
      globalTime,
      trackerKeystrokesNumber,
      trackerMouseClicksNumber,
      trackerScreenshots,
      frameTime,
      startDate
    }
  })

  // ipcMain.on('disconnectConnection', async () => {
  //   if (intervalId) {
  //     trackerStore.set('connectionIntercepted', true)
  //     pauseTrackerState(intervalId)
  //     const screenshot = await captureScreen()
  //     trackerStore.set('trackerScreenshots', screenshot.toString('base64'))
  //     const frame = (await trackerStore.get('frameTime')) as number
  //     const urls = await getUrlsTracked(Math.round(Number(frame) / 60))
  //     trackerStore.set('urls', JSON.stringify(urls))
  //     new Notification({
  //       title: 'IMT - Tracker paused',
  //       body: 'Check your internet connection'
  //     }).show()
  //   }
  // })

  ipcMain.on('connectConnection', async (event: Electron.IpcMainEvent) => {
    //processCache()
  })

  ipcMain.on('resetTracker', async () => {
    resetTrackerState(trackerStore)
  })

  ipcMain.on('notify', (_, { title, body }) => {
    new Notification({ title, body }).show()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

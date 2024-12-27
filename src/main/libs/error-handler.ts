import { AxiosError } from 'axios'
import { Notification } from 'electron'
import log from '../utils/logger'
import { clearElectronState, clearTrackerState } from './tracker-actions'

export function handleError(
  error: unknown,
  tracker: { mouseClicks: number; keystrokes: number },
  event?: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent
): boolean {
  let isAuthError = false
  if (error instanceof AxiosError) {
    switch (error.response?.status) {
      case 401:
        handleUnauthorizedError(tracker, event)
        break
      case 402:
        handleAccountExpiredError(tracker, event)
        break
      case 403:
        handleUnauthorizedError(tracker, event)
        break
      case 500:
        handleServerError(tracker, event)
        break
      default:
        handleUnknownErrorAxios(tracker, event)
        break
    }
  } else {
    handleUnknownError(error, tracker, event)
  }
  return isAuthError
}

// Handle 401 Unauthorized Error
function handleUnauthorizedError(
  tracker: { mouseClicks: number; keystrokes: number },
  event?: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent
): void {
  clearElectronState(tracker)
  log.warn('Handle Error: Unauthorized 401')
  new Notification({
    title: 'IMT - Session expired',
    body: 'Please login again'
  }).show()
  event && event.sender.send('logout')
}

// Handle 402 Account Expired Error
function handleAccountExpiredError(
  tracker: { mouseClicks: number; keystrokes: number },
  event?: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent
): void {
  clearElectronState(tracker)
  log.warn('Handle Error: Account Expired 402')
  new Notification({
    title: 'IMT - Account expired',
    body: 'Your subscription has expired'
  }).show()
  event && event.sender.send('logout')
}

// Handle 500 Internal Server Error
function handleServerError(
  tracker: { mouseClicks: number; keystrokes: number },
  event?: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent
): void {
  clearTrackerState(tracker)
  log.warn('Handle Error: Server Error 500')
  new Notification({
    title: 'Server Error',
    body: 'An error occurred on the server. Please try again later.'
  }).show()
  event && event.sender.send('killTracker', true)
}

// Handle Unknown Errors
function handleUnknownErrorAxios(
  tracker: { mouseClicks: number; keystrokes: number },
  event?: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent
): void {
  clearTrackerState(tracker)
  log.warn('Handle Error: Unknown Axios Error')
  new Notification({
    title: 'Unexpected Error',
    body: 'An unexpected error occurred. Please try again later.'
  }).show()
  event && event.sender.send('killTracker', true)
}

function handleUnknownError(
  error: unknown,
  tracker: { mouseClicks: number; keystrokes: number },
  event?: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent
): void {
  clearTrackerState(tracker)
  log.warn('Handle Error: Unknown Error')
  new Notification({
    title: 'Unknown Error',
    body: JSON.stringify(error)
  }).show()
  event && event.sender.send('killTracker', true)
}

import { AxiosError } from 'axios'

export function handleError(error: unknown, logout: () => void): void {
  if (error instanceof AxiosError) {
    switch (error.response?.status) {
      case 401:
        handleUnauthorizedError(logout)
        break
      case 500:
        handleServerError()
        break
      default:
        handleUnknownErrorAxios()
        break
    }
  } else {
    handleUnknownError()
  }
}

// Handle 401 Unauthorized Error
function handleUnauthorizedError(logout: () => void): void {
  logout()
}

// Handle 500 Internal Server Error
function handleServerError(): void {}

// Handle Unknown Errors
function handleUnknownErrorAxios(): void {}

function handleUnknownError(): void {}

//handleError(e, api, formData, intervalId, keyEventListener)
// if (e instanceof AxiosError) {
//   if (e.code === 'ECONNRESET') {
//     return retryRequest(api, formData)
//   } else if (e.response?.status === 401) {
//     new Notification({
//       title: 'Start Tracking - Error encountered',
//       body: 'please login again'
//     }).show()
//     resetTrackerStore(trackerStore)
//     // 1 - send logout event and clear user state within electron
//     // 2 - send event to renderer to clear user state (if not cleared)
//   }
// } else {
//   console.log('An error occurred:', e)
// }

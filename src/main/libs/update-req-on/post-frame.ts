import { AxiosError } from 'axios'
import log from '../../utils/logger'
import { processCache, saveToCache } from '../../utils/storage-action'
import api from '../axios-interceptor'
import checkNetworkConnectivity from '../check-connectivity'
import { handleError } from '../error-handler'
import retryRequest from '../retry-request'

export async function postFrameOnHandle(
  screenshot: Buffer,
  frame: number,
  keys: number,
  clicks: number,
  urlData: string,
  applications_data: string,
  oldStartDate: string,
  tracker: {
    mouseClicks: number
    keystrokes: number
  },
  event?: Electron.IpcMainEvent | Electron.IpcMainInvokeEvent
) {
  const formData = new FormData()
  const endDate = new Date().toISOString()
  formData.append('file', new Blob([screenshot]))
  formData.append('time', frame.toString())
  formData.append('keystrokes', keys.toString())
  formData.append('clicks', clicks.toString())
  formData.append('urlData', urlData)
  formData.append('applications_data', applications_data)
  formData.append('endDate', endDate)
  formData.append('startDate', oldStartDate.toString())
  checkNetworkConnectivity()
    .then(async () => {
      try {
        log.info('Sending frame data to api tracker')
        const response = await retryRequest(api, formData)
        if (response === true) log.info('frame saved successfully')
      } catch (error) {
        log.warn('Error post api tracker:', error)
        handleError(error, tracker, event)
        return
      } finally {
        processCache()
      }
    })
    .catch(() => {
      log.warn('No internet Connection detected')
      log.info('Saving frame data to cache')
      saveToCache(
        screenshot,
        frame,
        keys,
        clicks,
        urlData,
        applications_data,
        endDate,
        oldStartDate,
        event
      )
    })
}

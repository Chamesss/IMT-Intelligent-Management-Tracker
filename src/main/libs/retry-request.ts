import { AxiosError, AxiosInstance } from 'axios'
import log from '../utils/logger'

export default async function retryRequest(
  api: AxiosInstance,
  formData: FormData,
  maxRetries = 5,
  delay = 1000
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await api.post('/api/tracker/update-tracker', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      return true
    } catch (e) {
      if (attempt >= maxRetries) {
        log.warn(`Max retries (${maxRetries}) exceeded. Last error: ${e}`)
        throw new Error(`Max retries (${maxRetries}) exceeded. Last error: ${e}`)
      }

      if (e instanceof AxiosError) {
        const status = e.response?.status // Access safely to prevent errors

        log.warn(
          `Sending Frame Failed: Attempt ${attempt} failed with Axios error: ${e.code}, Retrying...`
        )

        if (e.code === 'ECONNRESET' || e.code === 'ECONNABORTED' || !e.response) {
          log.warn('Connection error, retrying...')
          await new Promise((resolve) => setTimeout(resolve, delay))
          delay *= 2
        } else if (status && status >= 500) {
          log.warn('Server error, retrying...')
          await new Promise((resolve) => setTimeout(resolve, delay))
          delay *= 2
        } else {
          log.warn('Unknown Axios error, exiting retry loop.')
          throw e
        }
      } else {
        log.warn(
          `Attempt ${attempt} failed with a non-Axios error: '${JSON.stringify(e)}', retrying...`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2
      }
    }
  }

  log.warn('Max retries exceeded.')
  return false
}

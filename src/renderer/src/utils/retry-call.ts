import { AxiosError } from 'axios'

export default async function retryRequest(fn, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError) {
        if (error.response && error.response.status === 401) {
          throw error
        }
      }

      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        throw error
      }
    }
  }
}

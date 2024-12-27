import axios from 'axios'
import { BrowserWindow } from 'electron'
import { userStore } from '../store'
import log from '../utils/logger'

const BASE_URL = import.meta.env.VITE_KEY_API_URL

//Create an axios instance
const api = axios.create({
  baseURL: BASE_URL, // base url
  headers: {
    'Content-Type': 'application/json' // headers type
  }
})

api.interceptors.request.use(
  async (config) => {
    const accessToken = (await userStore.get('accessToken')) as string
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}` // set in header
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const setupAxiosInterceptors = (mainWindow: BrowserWindow) => {
  api.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const originalRequest = error.config
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        const refreshToken = userStore.get('refreshToken') as string
        if (refreshToken) {
          try {
            const response = await axios.post(`${BASE_URL}/api/user/refresh-token`, {
              token: refreshToken
            })
            const newAccessToken = response.data.accessToken
            userStore.set('accessToken', newAccessToken)
            mainWindow.webContents.send('updateAccessToken', newAccessToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return api(originalRequest) //recall Api with new token
          } catch (error) {
            mainWindow.webContents.send('logout')
            return Promise.reject(error)
          }
        } else {
          mainWindow.webContents.send('logout')
          return Promise.reject(error)
        }
      } else if (error.response.status === 403) {
        mainWindow.webContents.send('logout')
        return Promise.reject(error)
      } else if (error.response.status === 402) {
        mainWindow.webContents.send('logout')
        return Promise.reject(error)
      }
      log.warn('Axios Interceptor: ', error.response.status)
      //mainWindow..send('logout')
      //handle error here ?
      return Promise.reject(error)
    }
  )
}

export default api

// axios interceptor
// https://chatgpt.com/share/ba726f35-0e67-4b44-9407-7f005df7e9d1

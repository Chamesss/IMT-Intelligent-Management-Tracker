// axiosInstance.js
import axios from 'axios'
import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useSocket } from './useSocket'

const BASE_URL = import.meta.env.VITE_KEY_API_URL

const api = axios.create({
  baseURL: BASE_URL, // base url
  headers: {
    'Content-Type': 'application/json' // headers type
  }
})

// Token refresh logic within interceptors
export const useAxiosInterceptors = () => {
  const { logout } = useAuth()
  const socket = useSocket()

  useEffect(() => {
    // Request Interceptor to add token to headers
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        const socketId = socket.id
        if (socketId) {
          config.headers['x-socket-id'] = socketId
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response Interceptor to refresh token on 401 errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true // Mark the request to prevent an infinite loop

          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) {
              console.log('refresh token not found, logging out')
              logout()
              return Promise.reject(error)
            }
            const response = await axios.post(`${BASE_URL}/api/user/refresh-token`, {
              token: refreshToken
            })

            console.log('access token has been changed, proceed with the request')

            const newAccessToken = response.data.accessToken
            localStorage.setItem('accessToken', newAccessToken)
            window.api.updateAccessTokenMain(newAccessToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return api(originalRequest)
          } catch (refreshError) {
            console.log('error during getting new access token, logging out', refreshError)
            logout()
            window.api.logoutMain()
            return Promise.reject(refreshError)
          }
        } else if (error.response && error.response.status === 402) {
          window.api.logoutMain()
          logout()
          window.api.sendNotification('Account expired.', 'Your subscription has expired')
          return Promise.reject(error)
        }
        console.log('another error to handle', error.response)
        // window.api.logoutMain()
        // logout()
        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.response.eject(responseInterceptor)
    }
  }, [logout])

  return api
}

export default api

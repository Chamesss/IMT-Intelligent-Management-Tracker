import { useSocket } from '@/hooks/useSocket'
import { createBrowserHistory } from 'history'
import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext<any | undefined>(undefined)
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken') || '')
  const [userGlobal, setUserGlobal] = useState<userState | undefined>(
    JSON.parse(localStorage.getItem('user') || '{}') || undefined
  )
  const socket = useSocket()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    if (user && token) {
      setToken(localStorage.getItem('accessToken'))
      setUserGlobal(JSON.parse(user))
      window.api.setUser({
        userId: (JSON.parse(user) as userState)._id,
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
      })
    } else {
      setToken(null)
      window.api.setUser({
        userId: '',
        accessToken: '',
        refreshToken: ''
      })
      logout()
    }
  }, [])

  const login = (accessToken: string, refreshToken: string, user: userState) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    setUserGlobal(user)
    socket.emit('joinRoom', { userId: user._id, companyId: user.companyId })
    setToken(accessToken)
    window.api.setUser({ userId: user._id, accessToken, refreshToken })
  }
  const logout = async () => {
    window.api.logoutMain()
    resetUserState(socket)
  }

  const logoutFromMain = () => {
    resetUserState(socket)
  }

  const resetUserState = (socket) => {
    const history = createBrowserHistory()
    socket.emit('logout', {
      userId: userGlobal?._id,
      companyId: userGlobal?.companyId,
      status: 'offline'
    })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUserGlobal(undefined)
    setToken(null)
    history.push('/login')
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, userGlobal, setUserGlobal, logoutFromMain }}
    >
      {children}
    </AuthContext.Provider>
  )
}

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')

  window.api.logoutMain()
  history.push('/login')
}

import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './assets/main.css'
import { AuthProvider } from './contexts/auth-provider'
import { ChatProvider } from './contexts/chat-provider'
import { CompanyProvider } from './contexts/company-context'
import { NotificationsProvider } from './contexts/notifications-provider'
import { SocketProvider } from './contexts/socket-provider'
import { TaskProvider } from './contexts/task-provider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <SocketProvider>
    <AuthProvider>
      <CompanyProvider>
        <TaskProvider>
          <NotificationsProvider>
            <ChatProvider>
              <App />
              <Toaster position="bottom-left" />
            </ChatProvider>
          </NotificationsProvider>
        </TaskProvider>
      </CompanyProvider>
    </AuthProvider>
  </SocketProvider>
)

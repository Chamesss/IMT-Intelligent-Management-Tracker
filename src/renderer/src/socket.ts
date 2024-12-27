import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.VITE_KEY_API_URL

const SOCKET_URL = BASE_URL
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  timeout: 60000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 5000,
  autoConnect: true
})

export default socket

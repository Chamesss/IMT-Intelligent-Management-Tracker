import net from 'net'
import log from '../utils/logger'

export default function checkNetworkConnectivity(
  host = 'www.google.com',
  port = 80,
  timeout = 2000
) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket()
    const timer = setTimeout(() => {
      socket.destroy()
      reject(new Error('Connection timeout'))
    }, timeout)

    socket.connect(port, host, () => {
      clearTimeout(timer)
      socket.end()
      resolve(true)
    })

    socket.on('error', (err) => {
      log.warn('Error checking network connectivity:', err)
      clearTimeout(timer)
      reject(err)
    })
  })
}

import { uIOhook } from 'uiohook-napi'
import log from '../utils/logger'

export const createKeyListener = (tracker: { mouseClicks: number; keystrokes: number }) => {
  uIOhook.on('keydown', () => {
    tracker.keystrokes++
  })

  uIOhook.on('mousedown', () => {
    tracker.mouseClicks++
  })

  const startListener = () => {
    try {
      uIOhook.start()
    } catch (error) {
      log.warn('Error starting listener:', error)
    }
  }

  const stopListener = () => {
    uIOhook.removeAllListeners()
    tracker.keystrokes = 0
    tracker.mouseClicks = 0
  }

  return {
    startListener,
    stopListener
  }
}

export const forceStopListener = () => {
  uIOhook.removeAllListeners()
}

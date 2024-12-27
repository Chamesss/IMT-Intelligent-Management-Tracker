import { WindowWithTime, winResult } from '../types'
import log from '../utils/logger'

let activeWinListener: NodeJS.Timeout | null = null

export async function getActiveWin(windowsWithTimeSpend: WindowWithTime[]): Promise<void> {
  const { activeWindow, openWindows } = await import('get-windows')

  const updateWindowsList = async (): Promise<void> => {
    const win = (await openWindows()) as winResult[]
    windowsWithTimeSpend.length = 0
    win.forEach((w) => {
      windowsWithTimeSpend.push({
        title: w.title,
        id: w.id,
        owner: {
          name: w.owner.name,
          path: w.owner.path
        },
        platform: w.platform,
        timeSpent: 0
      })
    })
  }

  await updateWindowsList()

  // Set up a listener to update the active window every second
  activeWinListener = setInterval(async () => {
    try {
      const active = await activeWindow()
      if (active) {
        const index = windowsWithTimeSpend.findIndex((w) => w.id === active.id)
        if (index > -1) {
          // Increment time spent for the active window
          windowsWithTimeSpend[index].timeSpent += 1
        } else {
          windowsWithTimeSpend.push({
            title: active.title,
            id: active.id,
            owner: {
              name: active.owner.name,
              path: active.owner.path
            },
            platform: active.platform,
            timeSpent: 1
          })
        }
      }
    } catch (error) {
      log.warn('Error getting active window:', error)
    }
  }, 1000)
}

export function stopActiveWinListener(): void {
  if (activeWinListener) {
    clearInterval(activeWinListener)
    activeWinListener = null
  }
}

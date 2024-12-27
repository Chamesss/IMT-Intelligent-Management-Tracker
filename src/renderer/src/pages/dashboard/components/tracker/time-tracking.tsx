import Spinner from '@/components/spinner'
import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useSocket } from '@/hooks/useSocket'
import { cn } from '@/lib/utils'
import { handleError } from '@/middlewares/error-mapping'
import { Button } from '@/ui/button'
import { Clock4 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNetworkState } from 'react-use'

export default function TimeTracking() {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const isOnline = useNetworkState()
  const { logout, userGlobal } = useAuth()
  const [loading, setLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const api = useAxiosInterceptors()
  const socket = useSocket()

  useEffect(() => {
    if (isOnline) {
      ;(async () => {
        await window.api.connectInternet()
      })()
    }
    // else {
    //   setTimeout(async () => {
    //     if (!isOnline) {
    //       try {
    //         await window.api.disconnectInternet()
    //       } catch (e) {
    //         console.error('Error pausing tracker', e)
    //       } finally {
    //         setTime(0)
    //         setIsRunning(false)
    //       }
    //     }
    //   }, 3000)
    // }
  }, [isOnline])

  // useEffect(() => {
  //   socket.on('joinedRoom', (data) => {
  //     localStorage.setItem('socket', data)
  //     // Handle the success response
  //   })
  //   return () => {
  //     socket.off('joinedRoom')
  //   }
  // }, [])

  useEffect(() => {
    ;(async () => {
      setTimeout(async () => {
        const response = await window.api.getTrackerState()
        setTime(response.globalTime)
        setLoading(false)
      }, 1000)
    })()

    const removeListener = window.api.onUpdateTime((time) => {
      setTime(time)
    })

    const removePauseListener = window.api.onPauseTracker(() => {
      setIsRunning(false)
    })

    window.api.onSystemAwake(() => {
      setIsRunning(false)
    })

    // ;(async () => {
    //   const response = await window.api.getTrackerState()
    //   if (response.trackerId.length === 0) {
    //     setIsRunning(false)
    //     setTime(0)
    //     window.api.resetTracker()
    //   } else {
    //     setIsRunning(false)
    //     setTime(response.globalTime)
    //   }
    // })()

    const removeResumeListener = window.api.onTrackerResumed((time) => {
      setTime(time)
    })
    return () => {
      removeListener()
      removeResumeListener()
      removePauseListener()
    }
  }, [])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartTime = async () => {
    try {
      setOperationLoading(true)
      socket.emit('joinRoom', {
        userId: userGlobal._id,
        companyId: userGlobal.companyId,
        status: 'online'
      })
      await window.api.startTracker()
      setIsRunning(true)
      try {
        await api.post('/api/tracker/tracker/start')
      } catch (e) {
        console.log(e)
        //handleError(e, logout)
      }
    } catch (e) {
      console.error('Error starting tracker', e)
    } finally {
      setOperationLoading(false)
    }
  }

  const handlePauseTime = async () => {
    try {
      setOperationLoading(true)
      const response: number = await window.api.pauseTracker()
      console.log(response)
      setTime(response)
      try {
        await api.post('/api/tracker/tracker/stop')
      } catch (e) {
        //handleError(e, logout)
        console.error('Error sending notification', e)
      }
    } catch (e) {
      console.error('Error pausing tracker', e)
    } finally {
      setIsRunning(false)
      setOperationLoading(false)
    }
  }

  const handleResetTime = async () => {
    try {
      setOperationLoading(true)
      await window.api.stopTracker()
      setTime(0)
      try {
        await api.post('/api/tracker/tracker/stop')
      } catch (e) {
        //handleError(e, logout)
        console.error('Error sending notification', e)
      }
    } catch (e) {
      handleError(e, logout)
      console.error('Error stopping tracker', e)
    } finally {
      setIsRunning(false)
      setOperationLoading(false)
    }
  }

  const handleResumeTime = async () => {
    try {
      setOperationLoading(true)
      socket.emit('joinRoom', {
        userId: userGlobal._id,
        companyId: userGlobal.companyId,
        status: 'online'
      })
      await window.api.resumeTracker()
      setIsRunning(true)
      try {
        await api.post('/api/tracker/tracker/start')
      } catch (e) {
        console.error('Error sending notification', e)
        //handleError(e, logout)
      }
    } catch (e) {
      console.error('Error starting tracker', e)
      //handleError(e, logout)
    } finally {
      setOperationLoading(false)
    }
  }

  return (
    <div className="flex h-[13rem] flex-col items-center justify-start rounded-lg border-[0.12rem] border-custom bg-white font-dm dark:border-neutral-900 dark:bg-neutral-800">
      <div className="relative flex w-full flex-row gap-2 border-b border-custom p-4 font-dm text-base font-medium dark:border-black">
        <Clock4 />
        <h1 className="text-base font-medium">Time Tracking</h1>
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-between py-2">
        <h1 className="text-base text-mediumGray">Good Afternoon</h1>
        {loading ? (
          <Spinner className="!border-black !border-t-transparent dark:!border-transparent dark:!border-white" />
        ) : (
          <h1 className="text-[2.5rem]">{formatTime(time)}</h1>
        )}

        <div
          className={cn('mb-2 flex gap-4', {
            'pointer-events-none': operationLoading,
            'pointer-events-auto': !operationLoading
          })}
        >
          {!isRunning && time === 0 ? (
            <Button
              className={`w-[8.358rem] border border-black bg-white text-base text-black hover:text-white dark:border-neutral-900 dark:bg-neutral-950 dark:text-white dark:hover:bg-white dark:hover:text-black ${(isRunning || time > 0) && 'w-fit'} ${!isOnline && 'cursor-not-allowed border-opacity-50'}`}
              onClick={handleStartTime}
              disabled={!isOnline.online || loading}
            >
              {'Start'}
            </Button>
          ) : (
            <>
              {!isRunning && time > 0 ? (
                <Button
                  className={`w-[8.358rem] border border-black bg-white text-base text-black hover:text-white dark:border-neutral-900 dark:bg-neutral-950 dark:text-white dark:hover:bg-white dark:hover:text-black ${(isRunning || time > 0) && 'w-fit'}`}
                  onClick={handleResumeTime}
                >
                  {'resume'}
                </Button>
              ) : (
                <Button
                  className={`w-[8.358rem] border border-black bg-white text-base text-black hover:text-white dark:border-neutral-900 dark:bg-neutral-950 dark:text-white dark:hover:bg-white dark:hover:text-black ${(isRunning || time > 0) && 'w-fit'}`}
                  onClick={handlePauseTime}
                >
                  {'pause'}
                </Button>
              )}
              <Button
                className={`w-[8.358rem] border border-black bg-white text-base text-black hover:text-white dark:border-neutral-900 dark:bg-neutral-950 dark:text-white dark:hover:bg-white dark:hover:text-black ${(isRunning || time > 0) && 'w-fit'}`}
                onClick={handleResetTime}
              >
                {'stop'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { TouchEvent, WheelEvent, useRef } from 'react'

const useFixScrollForModaledPopovers = () => {
  const touchPosRef = useRef<number | null>(null)

  const onScroll = (event: WheelEvent<HTMLDivElement>) => {
    event.stopPropagation()
    const isScrollingDown = event.deltaY > 0
    if (isScrollingDown) {
      event.currentTarget.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    } else {
      event.currentTarget.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    }
  }

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchPosRef.current = event.changedTouches[0]?.clientY ?? null
  }

  const onTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const touchPos = event.changedTouches[0]?.clientY ?? null
    if (touchPosRef.current === null || touchPos === null) return

    event.stopPropagation()

    const isScrollingDown = touchPosRef.current < touchPos

    if (isScrollingDown) {
      event.currentTarget.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    } else {
      event.currentTarget.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    }

    touchPosRef.current = touchPos
  }

  return { onScroll, onTouchStart, onTouchMove }
}

export default useFixScrollForModaledPopovers

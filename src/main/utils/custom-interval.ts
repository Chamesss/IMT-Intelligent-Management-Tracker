type IntervalCallback = (currentTime: number, drift: number) => void

export function customInterval(callback: IntervalCallback, interval: number): { stop: () => void } {
  const intervalMs = interval // Time in ms
  let expectedTime = performance.now() + intervalMs
  let active = true

  function runInterval() {
    if (!active) return

    const currentTime = performance.now()
    const drift = currentTime - expectedTime

    // Call the callback, passing the current time and drift
    callback(currentTime, drift)

    // Reset the expected time to the next interval target, compensating for any drift
    expectedTime += intervalMs

    // Schedule the next run, aiming for the precise next interval
    setTimeout(runInterval, Math.max(0, intervalMs - (performance.now() - expectedTime)))
  }

  // Start the interval with the first setTimeout
  setTimeout(runInterval, intervalMs)

  return {
    stop: () => {
      active = false
    }
  }
}

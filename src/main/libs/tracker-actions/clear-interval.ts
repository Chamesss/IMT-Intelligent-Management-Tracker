export function clearIntervalId(
  intervalId: {
    stop: () => void
  } | null
) {
  if (intervalId !== null) {
    intervalId.stop()
    intervalId = null
  }
}

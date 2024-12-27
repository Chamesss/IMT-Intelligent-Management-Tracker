import { trackerStore, userStore } from '../store'
export const logout = () => {
  resetTrackerState(trackerStore)
  userStore.reset()
}

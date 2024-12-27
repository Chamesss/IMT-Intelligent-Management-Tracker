import Store from 'electron-store'
import { trackerIdSchema } from '../store/tracker-store'
import { userSchema } from '../store/user-schema'
export const userStore = new Store(userSchema)
export const trackerStore = new Store(trackerIdSchema)

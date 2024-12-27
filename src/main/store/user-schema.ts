import { Options } from 'electron-store'

export const userSchema: Options<Record<string, unknown>> = {
  schema: {
    userId: {
      type: 'string',
      default: ''
    },
    accessToken: {
      type: 'string',
      default: ''
    },
    refreshToken: {
      type: 'string',
      default: ''
    }
  }
}

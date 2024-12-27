import { Options } from 'electron-store'

export const trackerIdSchema: Options<Record<string, unknown>> = {
  schema: {
    globalTime: {
      type: 'number',
      default: 0
    },
    trackerKeystrokesNumber: {
      type: 'number',
      default: 0
    },
    trackerMouseClicksNumber: {
      type: 'number',
      default: 0
    },
    frameTime: {
      type: 'number',
      default: 0
    },
    startDate: {
      type: 'string',
      default: ''
    },
    windowsWithTimeSpend: {
      type: 'string',
      default: ''
    },
    urls: {
      type: 'string',
      default: ''
    },
    // values to delete
    screenshot: {
      type: 'string',
      default: ''
    },
    compressedScreenshot: {
      type: 'string',
      default: ''
    },
    connectionIntercepted: {
      type: 'boolean',
      default: false
    },
    cache: {
      type: 'array',
      default: []
    }
  }
}

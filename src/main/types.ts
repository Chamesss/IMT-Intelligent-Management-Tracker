export type BrowserHistoryResult = {
  browser: string
  title: string
  url: string
  utc_time: number
}[]

export interface winResult {
  id: number
  title: string
  owner: {
    name: string
    path: string
  }
  platform: string
}

export interface WindowWithTime extends winResult {
  timeSpent: number
}

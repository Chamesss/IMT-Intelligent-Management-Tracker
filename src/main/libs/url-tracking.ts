import browserHistory from 'node-browser-history'
import log from '../utils/logger'

export default function getBaseDomainUrls(time: number) {
  return new Promise((resolve, reject) => {
    browserHistory
      .getAllHistory(Number(time) === 0 ? 1 : time)
      .then((history) => {
        const filteredUrls = history.flat().map((item) => {
          try {
            const url = new URL(item.url)
            return { ...item, url: url.hostname }
          } catch (error) {
            return item
          }
        })
        resolve(filteredUrls)
      })
      .catch((error) => {
        log.warn('Error tracking URLs:', error)
        reject(error)
      })
  })
}

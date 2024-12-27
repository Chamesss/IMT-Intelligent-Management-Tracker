export const timeAgo = (timestamp: string) => {
  const now = new Date().getTime()
  const past = new Date(timestamp).getTime()
  const diffInSeconds = Math.floor((now - past) / 1000)

  const units = [
    { name: 'y', seconds: 31536000 },
    { name: 'm', seconds: 2592000 },
    { name: 'd', seconds: 86400 },
    { name: 'h', seconds: 3600 },
    { name: 'min', seconds: 60 },
    { name: 's', seconds: 1 }
  ]

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds)
    if (value >= 1) {
      return `${value}${unit.name}${value > 1 ? (unit.name === 's' ? '' : 's') : ''}`
    }
  }

  return 'just now'
}

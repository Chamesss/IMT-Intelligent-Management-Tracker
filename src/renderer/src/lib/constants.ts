export const tableHead = [
  'Project',
  'Status',
  'Priority',
  'Start',
  'Estimated Time',
  // 'Time Tracked',
  // 'Over Time',
  'Tags'
]

export const projectStatus = ['In Progress', 'In Review', 'Blocked']

export let initialColumns: InitialColumns = {
  toBeDone: {
    id: 'toBeDone',
    color: '#a3a3a3',
    title: 'To Be Done',
    tasks: []
  },
  inProgress: {
    id: 'inProgress',
    color: '#fbbf24',
    title: 'In Progress',
    tasks: []
  },
  inReview: {
    id: 'inReview',
    color: '#3b82f6',
    title: 'In Review',
    tasks: []
  },
  done: {
    id: 'done',
    color: '#4ade80',
    title: 'Done',
    tasks: []
  },
  blocked: {
    id: 'blocked',
    color: '#f87171',
    title: 'Blocked',
    tasks: []
  }
}

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

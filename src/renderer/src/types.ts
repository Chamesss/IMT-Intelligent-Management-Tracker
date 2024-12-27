interface userState {
  _id: string
  email: string
  password: string
  birthDate: string
  name: string
  location: string
  phone: string
  profession: string
  address: string
  money: number
  hours: number
  profilePicture: string
  role: string
  department: string
  languages: string[]
  totalProjects: number
  totalTasks: number
  companyId: string
  createdAt: string
  updatedAt: string
}

interface userAuth {
  token: string | undefined
  refresh: string | undefined
  user: userState | undefined
  isAuth: boolean
}

interface project {
  _id: string
  userId: string
  startDate: string
  isIA?: boolean
  name: string
  status: string
  priority: string
  estimatedTime: string
  timeTracked: string
  overtime: string
  tags: string[]
  description: string
  createdAt: string
  updatedAt: string
  endsAt: string
  membres: TeamMember[]
}

interface participant {
  userId: string
  profilePicture: string
  name: string
  role: string
}

interface TeamMember {
  _id: string
  name: string
  profilePicture: string
  status: 'online' | 'offline'
  activity_status: string
  role: string
  unreadMessages: number
}
interface conversationOpened {
  userId: string
  name: string
  profilePicture: string
  role: string
  isOpened: boolean
  activity_status: string
  status: 'online' | 'offline'
  newMessage: boolean
}

interface Notification {
  _id: string
  sender: string
  receiver: string
  message: string
  read: boolean
  timestamp: string
  createdAt: string
  updatedAt: string
}

interface User {
  _id: string
  name: string
  profilePicture?: string
  role: string
  profession: String
  email?: string
  status: string
  phone: unknown
  projectCount?: number
  skills?: string[]
  department: string
  totalTasks: Number
  languages: string[]
  company: Company
}

type InitialColumns = {
  [key: string]: {
    id: string
    color: string
    title: string
    tasks: (task & { id: string })[]
  }
}

interface task {
  name: string
  status: string
  priority: string
  createdAt: string
  estimatedTime: string
  timeTracked: string
  overtime: string
  startDate: string
  creatorId: string
  deadline: string
  description: string
  projectId: string
  membres: string[]
  order: number
  tags: string[]
  type: string
  _id: string
  updatedAt: string
  reason: string
  comments: comments[]
}

interface message {
  fileUrl: any
  message: string
  receiver: string
  sender: string
  createdAt: string
}

interface meeting {
  _id: string
  url: string
  date: string
  name: string
  creatorId: string
  members: string[]
  createdAt: string
  updatedAt: string
  description: string
}

interface holiday {
  _id: string
  reason: string
  start_date: string
  end_date: string
  userId: string
  createdAt: string
  updatedAt: string
}

interface searchResultType {
  projects: {
    _id: string
    name: string
  }[]
  tasks: {
    _id: string
    projectId: string
    projectName: string
    tasks: {
      taskName: string
      _id: string
    }[]
  }[]
  messages: {
    createdAt: string
    message: string
    receiver: {
      name: string
      profilePicture: string
      _id: string
    }
    sender: {
      name: string
      profilePicture: string
      _id: string
    }
    _id: string
  }[]
}

type notifications = {
  type: 'general' | 'message' | 'event' | 'work' | 'comment'
  user: {
    _id: string
    name: string
    profilePicture: string
  }
  action: string
  title: string
  message: string
  messageId: string
  createdAt: string
  read: boolean
  commentId: string | null
  projectName: string | null
  projectId: string | null
}

interface EventData {
  _id: string
  title: string
  start: Date
  end: Date
}

interface BrowserHistoryResult {
  browser: string
  title: string
  url: string
  utc_time: number
}

interface Tracker {
  userId: string
  companyId: string
  frames: {
    time: string
    keystrokes_number_onkeyboard: string
    typing_number_withmouse: string
    startDate: Date
    endDate: Date
    urls: {
      title: string
      url: string
      browser: string
      time: string
    }[]
    applications_data: {
      id: string
      title: string
      owner: {
        name: string
        path: string
      }
      platform: string
      timeSpent: string
    }[]
    screens: {
      url: string
      datecaptured: Date
    }
  }[]
}

interface comments {
  _id: string
  commentId: string
  userId: string
  comment: string
  createdAt: string
  updatedAt: string
  files: {
    file: string
    fileType: string
    fileName: string
  }[]
}

interface ServerToClientEvents {
  connect: () => void
  disconnect: () => void
  message: (msg: string) => void
  customEvent: (data: any) => void
}

interface ClientToServerEvents {
  message: (msg: string) => void
  joinRoom: (data: any) => void
  // Add more events as needed
}

interface Company {
  _id: string
  name: string
  location: string
  logo: string
  phone: string
  createdAt: string
  email: string
}

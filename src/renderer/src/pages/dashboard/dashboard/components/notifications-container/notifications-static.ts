const notificationsStatic: notifications[] = [
  {
    type: 'general',
    user: {
      _id: '1',
      name: 'John Doe',
      profilePicture: 'https://via.placeholder.com/40'
    },
    action: 'liked your post',
    title: 'New Like',
    message: 'John Doe liked your recent post.',
    date: '2024-09-01T10:15:30Z',
    read: false
  },
  {
    type: 'message',
    user: {
      _id: '2',
      name: 'Jane Doe',
      profilePicture: 'https://via.placeholder.com/40'
    },
    action: 'sent you a message',
    title: 'New Message',
    message: 'Hello friend',
    date: '2024-09-02T14:22:10Z',
    read: false
  },
  {
    type: 'general',
    user: {
      _id: '3',
      name: 'Alex Smith',
      profilePicture: 'https://via.placeholder.com/40'
    },
    action: 'commented on your photo',
    title: 'New Comment',
    message: 'Alex Smith commented on your recent photo.',
    date: '2024-09-03T08:30:45Z',
    read: false
  },
  {
    type: 'message',
    user: {
      _id: '4',
      name: 'Chris Johnson',
      profilePicture: 'https://via.placeholder.com/40'
    },
    action: 'mentioned you in a comment',
    title: 'Mentioned in a Comment',
    message: 'Hello friend',
    date: '2024-09-03T12:45:30Z',
    read: false
  },
  {
    type: 'general',
    user: {
      _id: '5',
      name: 'Emma Brown',
      profilePicture: 'https://via.placeholder.com/40'
    },
    action: 'followed you',
    title: 'New Follower',
    message: 'Emma Brown started following you.',
    date: '2024-09-04T09:20:05Z',
    read: false
  }
]

export const generalNotifications = notificationsStatic.filter(
  (notification) => notification.type === 'general'
)
export const messageNotifications = notificationsStatic.filter(
  (notification) => notification.type === 'message'
)

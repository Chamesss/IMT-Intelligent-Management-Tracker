import { TaskContext } from '@/contexts/task-provider'
import { useContext } from 'react'

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('Task must be used within a Task provider')
  }
  return context
}

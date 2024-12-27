import { createContext, useState } from 'react'

export const TaskContext = createContext<any | undefined>(undefined)
export const TaskProvider = ({ children }) => {
  const [taskId, setTaskId] = useState<string | undefined>()

  return <TaskContext.Provider value={{ setTaskId, taskId }}>{children}</TaskContext.Provider>
}

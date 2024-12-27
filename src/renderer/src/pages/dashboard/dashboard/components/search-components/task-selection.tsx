import ProjectSvg from '@/assets/misc/project-svg'
import TaskSvg from '@/assets/misc/task-svg'
import Tag from '@/components/tag'
import api from '@/hooks/useAxiosInterceptor'
import { useTask } from '@/hooks/useTask'
import { Skeleton } from '@/ui/skeleton'
import { Clipboard } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  searchResults: searchResultType
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TaskSelection({ searchResults, setSearchOpen }: Props) {
  const navigate = useNavigate()
  const { setTaskId } = useTask()
  return (
    <React.Fragment>
      <p className="my-4 px-2 font-semibold text-muted-foreground dark:text-white/80">
        <Clipboard className="mb-0.5 mr-0.5 inline-block h-5 w-5 dark:text-white/80" /> In Tasks
      </p>
      {searchResults?.tasks.map((task) => (
        <div key={task._id} className="px-1">
          <div className="my-1 rounded-sm border border-black/5 bg-black/5 px-1 py-2 dark:!border-neutral-700 dark:bg-neutral-800">
            <div className="flex w-full flex-col items-start gap-3 rounded-xl border-b px-3 last:border-b-0">
              <div
                onClick={() => {
                  navigate('/task-kanban', {
                    state: {
                      projectId: task._id,
                      pageNumber: 0,
                      projectName: task.projectName
                    }
                  })
                  setSearchOpen(false)
                }}
                className="group my-2 flex flex-row items-center justify-start gap-1.5 text-base font-semibold"
              >
                <ProjectSvg className="inline-block h-6 w-6" />
                <p className="cursor-pointer group-hover:underline">{task.projectName}</p>
              </div>
              <div className="items grid w-full grid-cols-3 gap-2">
                {task.tasks.map((t) => (
                  <div
                    onClick={() => {
                      setTaskId(t._id)
                      navigate('/task-kanban', {
                        state: {
                          projectId: task._id,
                          pageNumber: 0,
                          projectName: task.projectName
                        }
                      })
                      setSearchOpen(false)
                    }}
                    className="group my-1 flex h-full w-full cursor-pointer flex-col items-start justify-start gap-2 self-end rounded-lg border border-black/5 bg-black/5 px-2 py-3 text-black hover:bg-black/10 dark:border dark:border-neutral-600 dark:bg-neutral-700"
                    key={t._id}
                  >
                    <div className="flex flex-row flex-nowrap truncate">
                      <TaskDetails task={t} />
                    </div>
                    <div className="mt-1 flex flex-row items-start gap-1.5">
                      <TaskSvg className="mt-1 h-6 w-6 group-hover:underline" />
                      <p className="mt-1 truncate text-wrap text-[0.8rem] capitalize group-hover:underline dark:text-white">
                        {t.taskName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  )
}

const TaskDetails = ({ task }: { task: { taskName: string; _id: string } }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  useEffect(() => {
    fetchTaskTags()
  }, [])

  const fetchTaskTags = async () => {
    try {
      const response = await api.get(`/api/task/getTask/${task._id}`)
      if (response.status === 200) {
        if (response.data.task.tags.length === 0) {
          setTags([])
        } else if (response.data.task.tags.length <= 2) {
          if (response.data.task.tags[1]) {
            if (response.data.task.tags[0].length + response.data.task.tags[1].length > 18) {
              setTags(() => {
                const tags = response.data.task.tags.slice(0, 1)
                tags.push('+' + (response.data.task.tags.length - 1).toString())
                return tags
              })
            } else {
              setTags(response.data.task.tags)
            }
          } else {
            setTags(response.data.task.tags)
          }
        } else if (response.data.task.tags.length > 2) {
          setTags(() => {
            const tags = response.data.task.tags.slice(0, 2)
            tags.push('+' + (response.data.task.tags.length - 2).toString())
            return tags
          })
        }
        setLoading(false)
        setError(false)
      }
    } catch (e) {
      console.log(e)
      setError(true)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-row items-center justify-center gap-1">
        <Skeleton className="h-[1.5rem] w-[3rem] rounded-xl" />
        <Skeleton className="h-[1.5rem] w-[3rem] rounded-xl" />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">Error fetching tags</p>
  }

  return (
    <div className="flex flex-row items-center justify-start gap-1">
      {tags.map((tag, i) => (
        <div key={tag} className="flex flex-row items-center justify-start gap-1">
          <Tag tag={tag} i={i} />
        </div>
      ))}
    </div>
  )
}

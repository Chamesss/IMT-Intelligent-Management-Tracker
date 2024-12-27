import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import EstimatedTime from '@/pages/dashboard/tasks/task-kanban/task-form/estimated-time'
import Name from '@/pages/dashboard/tasks/task-kanban/task-form/name'
import TagsInput from '@/pages/dashboard/tasks/task-kanban/task-form/tags-input'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Textarea } from '@/ui/textarea'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import AssignInput from '../assign-input-project-members'
import { DatePicker } from '../date-picker'
import Spinner from '../spinner'

export default function EditTaskForm({
  task,
  setEdit
}: {
  task: task
  setEdit: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [name, setName] = useState(task.name)
  const [reason, setReason] = useState(task.reason)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(task.startDate))
  const [estimatedTime, setEstimatedTime] = useState(task.estimatedTime)
  const [deadline, setDeadline] = useState<Date | undefined>(new Date(task.deadline))
  const [members, setMembers] = useState<User[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>(task.tags)
  const [selectedMembers, setSelectedMembers] = useState<string[]>(task.membres)
  const [description, setDescription] = useState(task.description)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const api = useAxiosInterceptors()

  useEffect(() => {
    startDate &&
      !deadline &&
      setDeadline(new Date(new Date(startDate).setHours(new Date(startDate).getHours() + 1)))
    startDate &&
      deadline &&
      startDate.getTime() >= deadline.getTime() &&
      setDeadline(new Date(new Date(startDate).setHours(new Date(startDate).getHours() + 1)))

    if (!startDate && deadline) {
      const date = new Date()
      if (date.getTime() >= deadline.getTime()) {
        setStartDate(new Date(new Date(deadline).setHours(new Date(deadline).getHours() - 1)))
      } else {
        setStartDate(new Date())
      }
    }
  }, [startDate, deadline])

  const handleEditTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !reason) {
      setError('Please fill all the fields')
      return
    }
    setLoading(true)
    const start = startDate || new Date()
    const end = deadline || new Date(new Date(start).setHours(new Date(start).getHours() + 1))
    try {
      const data = {
        reason,
        name: name,
        estimatedTime,
        startDate: start,
        deadline: end,
        membres: selectedMembers,
        tags: selectedTags,
        description,
        action: 'info'
      }
      const response = await api.post(`/api/task/update-urgent-task/${task._id}`, data)
      if (response.status === 200) {
        setLoading(false)
        setError('')
        setEdit(false)
      }
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError) {
        setError(error.response?.data.message)
      }
      //handleError(e, logout)
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 flex flex-col">
      <div className="space-y-3">
        <Label htmlFor="reason">Specify the reason for this task</Label>
        <Input
          onChange={(e) => setReason(e.target.value)}
          value={reason}
          placeholder={'Task reason'}
          className="h-[2.8rem] rounded-md"
        />
      </div>
      <form onSubmit={handleEditTask}>
        <div
          id="scrollable-container"
          className="h-full max-h-[25rem] w-full shrink flex-grow-0 space-y-3 overflow-y-scroll"
        >
          <hr className="!my-[1rem] mx-auto w-[90%] border-black border-opacity-10" />
          <div className="mx-auto w-[22.5rem]">
            <Name name={name} setName={setName} />
          </div>
          <div className="mx-auto flex w-[22.5rem] flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              onChange={(e) => setDescription(e.currentTarget.value)}
              value={description}
              className="mx-auto w-[22.5rem] resize-none rounded-md dark:bg-neutral-600"
              placeholder="Task description"
            />
          </div>
          <div className="mx-auto flex w-[22.5rem] flex-row justify-between gap-2">
            <EstimatedTime estimatedTime={estimatedTime} setEstimatedTime={setEstimatedTime} />
            <DatePicker
              classNameButton="h-[2.5rem]"
              classNameMain="gap-2"
              date={startDate}
              setDate={setStartDate}
              title="Start Date"
              touchFix={true}
              minStartDate={new Date(task.startDate)}
            />
            <DatePicker
              classNameButton="h-[2.5rem]"
              classNameMain="gap-2"
              date={deadline}
              setDate={setDeadline}
              title="Deadline"
              minStartDate={new Date(task.startDate)}
              touchFix={true}
            />
          </div>
          <hr className="!my-[1rem] mx-auto w-[90%] border-black border-opacity-10" />
          <div className="mx-auto flex w-[22.5rem] flex-col gap-2">
            {/*@ts-ignore*/}
            <AssignInput
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
              members={members}
              setMembers={setMembers}
              projectId={task.projectId}
              fixScroll={true}
            />
            <TagsInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          </div>
        </div>
        <div className="relative !mt-[2rem] flex w-full justify-center">
          <Button className="w-full rounded-2xl bg-black px-10 dark:text-white" type="submit">
            {loading ? <Spinner className="mx-auto !border-white !border-t-transparent" /> : 'Save'}
          </Button>
          {error && (
            <p className="absolute left-1/2 top-[-70%] -translate-x-1/2 text-red-500">{error}</p>
          )}
        </div>
      </form>
    </div>
  )
}

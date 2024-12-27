import Spinner from '@/components/spinner'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import EstimatedTime from './task-form/estimated-time'
import Name from './task-form/name'
//import Priority from './task-form/priority'
import AssignInput from '@/components/assign-input-project-members'
import { DatePicker } from '@/components/date-picker'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { Label } from '@/ui/label'
import toast from 'react-hot-toast'
import TagsInput from './task-form/tags-input'
//import TypeTask from './task-form/type-task'

export default function AddTaskForm({
  projectId,
  setIsOpen
}: {
  projectId: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [name, setName] = useState('')
  //const [type, setType] = useState('normal')
  const [reason, setReason] = useState('')
  const [estimatedTime, setEstimatedTime] = useState('')
  //const [priority, setPriority] = useState('')
  const [deadline, setDeadline] = useState<Date>()
  const [startDate, setStartDate] = useState<Date>()
  const [members, setMembers] = useState<User[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [description, setDescription] = useState('')
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name || !reason) {
      toast.error('Please fill all the fields')
      return
    }
    setLoading(true)
    const start = startDate || new Date()
    const end = deadline || new Date(new Date(start).setHours(new Date(start).getHours() + 1))
    try {
      const data = {
        reason,
        name: name || 'untitled',
        type: 'urgent',
        estimatedTime: estimatedTime || '0',
        priority: 'high',
        startDate: start,
        deadline: end,
        status: 'tobedone',
        overtime: '0',
        projectId: projectId,
        membres: selectedMembers,
        tags: selectedTags,
        timeTracked: '0',
        description
      }
      const response = await api.post('/api/task/add-task', data)
      if (response.status === 201) {
        toast.success('Task created successfully')
        setIsOpen(false)
      }
    } catch (error: unknown | AxiosError) {
      console.log(error)
      if (error instanceof AxiosError) {
        if (error.response) {
          setError(error.response.data.message)
        } else {
          setError('An error occurred')
        }
      }
      //handleError(e, logout)
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
      <form onSubmit={handleSubmit}>
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
              onChangeCapture={(e) => setDescription(e.currentTarget.value)}
              className="mx-auto w-[22.5rem] resize-none rounded-md dark:border-neutral-500 dark:bg-neutral-600"
              placeholder="Task description"
            />
          </div>
          <div className="mx-auto flex w-[22.5rem] flex-row justify-between gap-2">
            {/* <TypeTask type={type} setType={setType} /> */}
            <EstimatedTime estimatedTime={estimatedTime} setEstimatedTime={setEstimatedTime} />
            {/* <Priority priority={priority} setPriority={setPriority} /> */}
            <DatePicker
              date={startDate}
              setDate={setStartDate}
              classNameButton="h-[2.5rem]"
              classNameMain="gap-2"
              minStartDate={new Date()}
              touchFix={true}
              title="Start date"
            />
            <DatePicker
              date={deadline}
              setDate={setDeadline}
              classNameButton="h-[2.5rem]"
              classNameMain="gap-2"
              minStartDate={new Date()}
              touchFix={true}
              title="Deadline"
            />
          </div>
          <hr className="!my-[1rem] mx-auto w-[90%] border-black border-opacity-10" />
          <div className="mx-auto flex w-[22.5rem] flex-col gap-2">
            <AssignInput
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
              members={members}
              setMembers={setMembers}
              projectId={projectId}
              fixScroll={true}
            />
            <TagsInput selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
          </div>
        </div>
        <div className="relative !mt-[2rem] w-full flex-grow justify-center">
          <Button
            className="w-full rounded-2xl bg-black px-10 text-white hover:dark:text-opacity-70"
            type="submit"
          >
            {loading ? (
              <Spinner className="mx-auto !border-white !border-t-transparent" />
            ) : (
              'Create task'
            )}
          </Button>
          {error && (
            <p className="absolute left-1/2 top-0 -translate-x-1/2 text-red-500">{error}</p>
          )}
        </div>
      </form>
    </div>
  )
}

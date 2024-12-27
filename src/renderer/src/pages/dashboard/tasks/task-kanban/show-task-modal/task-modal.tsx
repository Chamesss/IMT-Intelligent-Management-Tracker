import GetUserNamePic from '@/components/misc/get-user-name-pic'
import Negative from '@/components/negative'
import PriorityLabel from '@/components/priority'
import Spinner from '@/components/spinner'
import Tag from '@/components/tag'
import CommentSection from '@/components/ticket-components/comment-section'
import EditTaskForm from '@/components/ticket-components/edit-task-form'
import InfoRow from '@/components/ticket-components/info-row'
import { useAuth } from '@/hooks/useAuth'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { useSocket } from '@/hooks/useSocket'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/ui/dropdown-menu'
import { Input } from '@/ui/input'
import calculateDisplayTime from '@/utils/calculate-display-time'
import { formatDate } from '@/utils/date-formatter'
import { getProfilePictureSrc } from '@/utils/get-profile-picture-src'
import { gradientStyle } from '@/utils/gradient'
import { AxiosError } from 'axios'
import {
  ChartNoAxesGantt,
  Clock,
  EllipsisVertical,
  FlagTriangleLeft,
  Paperclip,
  SendHorizontal,
  Star,
  TriangleAlert,
  UserRound
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import FileTooltip from './file-tooltip'

export default function TaskModal({ task, columnName }: { task: task; columnName: string }) {
  const { userGlobal }: { userGlobal: userState } = useAuth()
  const [deleteTask, setDeleteTask] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState('')
  const [edit, setEdit] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)
  const [comments, setComments] = useState<comments[]>([])
  const [comment, setComment] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const api = useAxiosInterceptors()
  const fileRef = useRef<HTMLInputElement>(null)
  const commentRef = useRef<HTMLDivElement>(null)
  const [loadingSubmitComment, setLoadingSubmitComment] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    ;(async () => {
      setLoadingComments(true)
      try {
        const response = await api.get(`/api/task/get-comments/${task._id}`)
        if (response.status === 200) setComments(response.data)
        if (response.status === 204) setComments([])
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingComments(false)
      }
    })()
  }, [])

  const deleteTaskHandler = async () => {
    try {
      setDeleteLoading(true)
      const response = await api.delete(`/api/task/delete-urgent-task/${task._id}`)
      if (response.status === 200) {
        window.api.sendNotification(
          'Task deleted',
          `Task ${task.name} has been successfully deleted`
        )
        setDeleteTask(false)
      }
      setDeleteLoading(false)
    } catch (e: unknown | AxiosError) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.error)
      }
      console.log(e)
      //handleError(e, logout)
    } finally {
      setDeleteLoading(false)
    }
  }

  async function handleSubmitComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoadingSubmitComment(true)
    if (!comment && !files) return
    try {
      const formData = new FormData()
      formData.append('comment', comment)
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append('files', file)
        })
      }
      const response = await api.post(`/api/task/add-comment/${task._id}`, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      if (response.status === 201) {
        setComments((prev: comments[]) => {
          return [...prev, response.data]
        })
        setComment('')
        resetFileInput()
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(`Error adding comment: please try again later ${error.response?.data.error}`)
      }
      console.log(error)
    } finally {
      setLoadingSubmitComment(false)
    }
  }

  const resetFileInput = () => {
    if (fileRef.current) {
      fileRef.current.value = ''
      setFiles(null)
    }
  }

  useEffect(() => {
    if (files === null) {
      resetFileInput()
    }
  }, [files])

  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.scrollTop = commentRef.current.scrollHeight
    }
  }, [comments])

  useEffect(() => {
    socket.on('commentAdded', (newComment: comments) => {
      if (newComment.userId === userGlobal._id) return
      setComments((prev: comments[]) => {
        const updatedComments = [...prev, newComment]
        return updatedComments
      })
    })
    socket.on('commentDeleted', ({ commentId }: { commentId: string }) => {
      setComments((prev: comments[]) => {
        const updatedComments = prev.filter((c) => c.commentId !== commentId)
        return updatedComments
      })
    })
    return () => {
      socket.off('commentAdded')
      socket.off('commentDeleted')
    }
  }, [])

  return (
    <React.Fragment>
      <DialogHeader>
        <DialogTitle className="flex w-full flex-col space-y-6">
          <div className="flex w-full flex-col justify-between">
            <div className="flex w-full flex-col">
              <div
                style={gradientStyle}
                className="relative flex w-full flex-row overflow-hidden rounded-xl p-4 text-white"
              >
                <div className="noisy" />
                <div className="z-[1] flex w-full flex-row justify-between">
                  <div className="z-[1] flex flex-row items-center">
                    <ChartNoAxesGantt className="mt-0.5" />
                    <p className="px-2 text-xl">{task.name}</p>
                  </div>

                  {/* dropdown for delete and edit */}
                  <div className="z-[1] mt-1 flex self-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="h-[1.15rem] w-[1.15rem] text-white" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="border-none dark:bg-neutral-700">
                        <DropdownMenuItem
                          onClick={() => setEdit(true)}
                          className="cursor-pointer text-muted-foreground hover:!text-muted-foreground/80 dark:text-white dark:hover:bg-neutral-600 dark:hover:!text-white/80"
                          disabled={task.creatorId !== userGlobal._id}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTask(true)}
                          className="cursor-pointer text-red-500 hover:!text-red-500/80 dark:text-red-500 dark:hover:bg-neutral-600 dark:hover:!text-red-500/80"
                          disabled={task.creatorId !== userGlobal._id}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialog open={deleteTask} onOpenChange={setDeleteTask}>
                      <AlertDialogContent className="dark:border-neutral-700 dark:bg-neutral-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Proceed with deleting task?</AlertDialogTitle>
                          <hr className="rounded-full bg-neutral-50 dark:bg-neutral-500" />
                          <AlertDialogDescription className="dark:text-white/80">
                            Delete <b>{task.name}</b> task? This action cannot be undone.
                            {error && <p className="text-red-500">{error}</p>}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-none dark:bg-white dark:text-black hover:dark:bg-black hover:dark:text-white">
                            Cancel
                          </AlertDialogCancel>
                          <Button
                            onClick={deleteTaskHandler}
                            className="flex w-[6rem] justify-center bg-red-500 py-2 hover:bg-red-400 dark:text-white"
                          >
                            {deleteLoading ? (
                              <Spinner className="mx-auto !border-black !border-t-transparent dark:!border-white dark:!border-t-transparent" />
                            ) : (
                              'Continue'
                            )}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
            <small className="mt-0.5 px-2 text-xs font-normal opacity-80">
              listed in{' '}
              <b>
                <span className="capitalize underline">{columnName}</span>{' '}
                {task.type === 'urgent' && <Tag tag="urgent" i={0} />}
              </b>
            </small>
          </div>
        </DialogTitle>
      </DialogHeader>
      <DialogDescription className="flex h-fit flex-col space-y-4 px-2">
        {/* Task Description */}
        <div className="flex flex-col space-y-2">
          <p className="text-base font-semibold text-neutral-800 dark:text-white">Description</p>
          <p className="text-sm text-neutral-500 dark:text-white/80">{task.description}</p>
        </div>

        {/* Task properties */}

        <div className="flex flex-col space-y-2">
          <p className="text-base font-semibold text-neutral-800 dark:text-white">Properties</p>
          <div className="px-2 text-sm text-neutral-500">
            <div className="grid grid-cols-2 gap-2">
              <InfoRow icon={Clock} label="Start At">
                {formatDate(task.startDate) || '-'}
              </InfoRow>

              <InfoRow icon={FlagTriangleLeft} label="Dead Line">
                {formatDate(task.deadline) || '-'}
              </InfoRow>

              <InfoRow icon={Star} label="Priority" className="relative">
                <PriorityLabel priority={task.priority} />
              </InfoRow>

              <InfoRow icon={Clock} label="Est. Time">
                {calculateDisplayTime(task.estimatedTime)}
              </InfoRow>

              <InfoRow icon={UserRound} label="Members" className="items-start">
                <div className="flex flex-row flex-wrap gap-1">
                  {/* @ts-ignore */}
                  {task.membres.length > 0 ? (
                    <React.Fragment>
                      {/* @ts-ignore */}
                      {task.membres.map((user: string, i: number) => (
                        <GetUserNamePic key={i} userId={user} index={i} />
                      ))}
                    </React.Fragment>
                  ) : (
                    <Negative />
                  )}
                </div>
              </InfoRow>

              <InfoRow icon={FlagTriangleLeft} label="Tags" className="items-start">
                <span className="flex w-fit flex-row flex-wrap gap-1">
                  {task.tags.length > 0 &&
                    task.tags.map((tag, i) => <Tag key={i} tag={tag} i={i} />)}
                </span>
              </InfoRow>
            </div>
          </div>
        </div>

        {/* Task Activities */}

        <div className="flex flex-col space-y-2">
          <p className="text-base font-semibold text-neutral-800 dark:text-white">Comments</p>

          {/* comment Section */}

          {loadingComments ? (
            <div className="flex h-20 flex-1">
              <Spinner className="mx-auto !border-black !border-t-transparent dark:!border-white dark:!border-t-transparent" />
            </div>
          ) : (
            <div
              ref={commentRef}
              className="scrollbar flex h-fit max-h-[32vh] w-full flex-col overflow-auto"
            >
              {comments.length <= 0 && (
                <div className="flex h-20 flex-1">
                  <p className="my-auto flex h-fit w-full justify-center text-nowrap text-center text-sm text-neutral-500 dark:text-white/80">
                    No comments yet
                  </p>
                </div>
              )}
              {comments.length > 0 &&
                comments.map((comment, i) => (
                  <React.Fragment key={i}>
                    <CommentSection setComments={setComments} comment={comment} taskId={task._id} />
                  </React.Fragment>
                ))}
            </div>
          )}

          <div className="text-sm text-neutral-500 dark:text-white/80">
            <form
              className="flex flex-row items-center gap-2 rounded-xl border border-input px-4 py-1.5 dark:border-neutral-600"
              onSubmit={handleSubmitComment}
            >
              <img
                src={getProfilePictureSrc(userGlobal.profilePicture, userGlobal.name)}
                alt="avatar"
                className="mb-2 h-[2rem] w-[2rem] self-end rounded-full object-contain"
              />
              <div className="relative flex w-full flex-col items-start gap-2">
                {files && (
                  <React.Fragment>
                    {Array.from(files).map((file: File, i: number) => (
                      <FileTooltip key={i} file={file} setFiles={setFiles} />
                    ))}
                  </React.Fragment>
                )}
                <div className="flex w-full flex-row items-center justify-between gap-2">
                  <div className="flex w-full flex-row items-center justify-between rounded-xl border border-input px-4 text-black dark:border-neutral-600">
                    <input
                      className="h-[2.5rem] w-full px-4 focus:outline-none dark:bg-neutral-800 dark:text-white"
                      placeholder="Write a comment..."
                      onChange={(e) => setComment(e.target.value)}
                      value={comment}
                    />
                    <button className="relative" type="submit">
                      {loadingSubmitComment ? (
                        <Spinner className="mx-auto !border-black !border-t-transparent dark:!border-white dark:!border-t-transparent" />
                      ) : (
                        <SendHorizontal
                          onClick={() => console.log('attach doc pressed')}
                          className="h-5 w-5 cursor-pointer transition-all hover:scale-105 active:scale-95 dark:text-white"
                        />
                      )}
                    </button>
                  </div>
                  <div className="group relative">
                    <Paperclip className="h-5 w-5 transform cursor-pointer transition-transform group-focus-within:scale-110 group-hover:scale-105 group-active:scale-95" />
                    <Input
                      type="file"
                      ref={fileRef}
                      multiple
                      accept=".pdf, .docx, .doc, .ppt, .pptx, .xls, .xlsx, .odt, .jpg, .jpeg, .png, .gif, .webp"
                      className="absolute left-1/2 top-1/2 z-[10] h-full w-full -translate-x-1/2 -translate-y-1/2 transform cursor-pointer opacity-0 group-hover:cursor-pointer"
                      onChange={(e) => {
                        if (e.currentTarget.files?.length === 0 && files !== null) {
                          return
                        }
                        setFiles(e.currentTarget.files)
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogDescription>

      {/* Edit task */}
      <Dialog open={edit} onOpenChange={setEdit}>
        <DialogContent className="h-fit !max-h-[90vh] dark:border-neutral-600 dark:bg-neutral-800">
          <DialogHeader className="mt-4">
            <div
              style={gradientStyle}
              className="absolute left-1/2 top-0 h-[1rem] w-full -translate-x-1/2 rounded-t-lg"
            >
              <div className="noisy" />
            </div>
            <DialogTitle className="mt-10 opacity-80">
              <TriangleAlert className="mb-1 mr-3 inline-block h-6 w-6" />
              Edit Urgent Task
            </DialogTitle>
            <DialogDescription>Fill out the form below to create urgent task.</DialogDescription>
          </DialogHeader>
          <EditTaskForm setEdit={setEdit} task={task} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

import ProjectCard from '@/components/project-card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog'
import { gradientStyle } from '@/utils/gradient'
import hexToRgba from '@/utils/hex-to-rgba'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { Plus, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import AddTaskForm from './add-task-form'

type Column = {
  id: string
  color: string
  title: string
  tasks: (task & { id: string })[]
}

export default function Column({
  column,
  height,
  containerRef,
  projectId
}: {
  column: Column
  height: number
  containerRef: React.RefObject<HTMLDivElement>
  projectId: string
}) {
  const [open, setIsOpen] = useState(false)

  return (
    <div
      className={`flex h-full !w-full flex-col rounded-lg border border-white p-1`}
      style={{
        backgroundColor: hexToRgba('#a3a3a3', 0.1),
        borderColor: hexToRgba('#a3a3a3', 0)
      }}
    >
      <div className="relative p-1 text-lg font-bold">
        <div className="flex items-center">
          <span
            style={{
              backgroundColor: column.color,
              boxShadow: `0 0 20px 2px ${column.color}`
            }}
            className={`mx-2 h-2 w-2 rounded-full backdrop-brightness-200`}
          />
          <p className="ml-2 font-dm text-base font-semibold tracking-wide">{column.title}</p>
        </div>
        {column.id === 'toBeDone' && (
          <div
            onClick={() => setIsOpen(true)}
            className="absolute right-[5%] top-1/2 -translate-y-1/2"
          >
            <Plus className="box-content h-5 w-5 cursor-pointer rounded-full bg-transparent p-1 transition-all hover:bg-black/40 hover:text-white" />
          </div>
        )}
      </div>
      <hr className="my-2" style={{ borderColor: hexToRgba('#ffffff', 1) }} />
      <div ref={containerRef} className="min-h-0 flex-1">
        <Droppable droppableId={column.id}>
          {(provided) => (
            <div
              style={{ height: `${height}px` }}
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="scrollbar flex h-full w-full flex-col overflow-y-scroll"
            >
              {column.tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="my-0.5 px-1"
                    >
                      <ProjectCard columnName={column.title} task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-h-[90vh] w-[30rem] dark:border-neutral-800 dark:bg-neutral-900"
        >
          <DialogHeader className="mt-4">
            <div
              style={gradientStyle}
              className="absolute left-1/2 top-0 h-[1rem] w-full -translate-x-1/2 rounded-t-lg"
            >
              <div className="noisy" />
            </div>
            <DialogTitle className="mt-10 opacity-80">
              <TriangleAlert className="mb-1 mr-3 inline-block h-6 w-6" />
              Create Urgent Task
            </DialogTitle>
            <DialogDescription>Fill out the form below to create urgent task.</DialogDescription>
          </DialogHeader>
          <AddTaskForm projectId={projectId} setIsOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

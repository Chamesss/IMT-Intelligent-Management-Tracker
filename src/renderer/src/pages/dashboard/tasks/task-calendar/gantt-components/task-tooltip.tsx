import GetAssignedUsers from '@/components/misc/get-assigned-members'
import { Task } from 'gantt-task-react'

export default function TaskTooltip({ task }: { task: Task }) {
  return (
    <div className="w-fit max-w-[20rem] rounded-md border-input bg-gray-800 px-4 py-2 text-white shadow-sm transition-all">
      <p className="text-wrap font-semibold">{task.name}</p>
      <hr className="my-2 border-gray-500" />
      <div className="flex flex-row gap-3">
        <span className="flex flex-col text-sm">
          <b>From </b>
          <p>{task.start.toLocaleDateString()}</p>
        </span>
        <span className="flex flex-col text-sm">
          <b>To </b>
          <p>{task.end.toLocaleDateString()}</p>
        </span>
      </div>
      {task.type === 'task' && (
        <>
          {/* @ts-ignore */}
          {task.membres.length > 0 && (
            <div className="mt-2 flex h-7 w-full justify-end">
              {/* @ts-ignore */}
              <GetAssignedUsers ids={task.membres} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

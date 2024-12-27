import { CircleCheckBig } from 'lucide-react'

export default function StatusBoxNewTasks({ tasks }: { tasks: number }) {
  return (
    <div className="flex h-[7rem] w-full items-center justify-center rounded-lg border-[0.12rem] border-custom bg-white px-4 dark:border-neutral-900 dark:bg-neutral-800">
      <div className="flex w-full flex-row items-center justify-start gap-4">
        <div className="flex h-[3.2rem] w-[3.2rem] rounded-full bg-[#F7F7F7] p-3">
          <CircleCheckBig className="h-full w-full text-black" />
        </div>
        <div>
          <p className="text-sm text-mediumGray">Total Tasks</p>
          <p className="text-[1.5rem] font-bold">{tasks || 0}</p>
        </div>
      </div>
    </div>
  )
}

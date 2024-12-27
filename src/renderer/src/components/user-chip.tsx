import { AtSign } from 'lucide-react'

export default function UserChip({ name }: { name: string }) {
  return (
    <div className="my-auto flex h-fit w-fit flex-row items-center text-nowrap rounded-[0.55rem] bg-neutral-200/80 px-2 py-[0.3rem] text-sm font-semibold capitalize text-neutral-500/90 dark:bg-neutral-500 dark:text-neutral-200">
      <AtSign className="mr-1.5 h-[1.15rem] w-[1.15rem] font-bold" /> {name}
    </div>
  )
}

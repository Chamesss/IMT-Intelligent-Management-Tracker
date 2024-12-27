import { cn } from '@/lib/utils'

export default function UserStatus({ status }: { status: 'online' | 'offline' }) {
  return (
    <div
      className={cn('absolute bottom-0 right-0 h-4 w-4 rounded-full border-[3px] border-white', {
        'bg-neutral-500': status === 'offline',
        'bg-green-500': status === 'online'
      })}
    />
  )
}

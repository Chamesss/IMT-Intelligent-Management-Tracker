import { cn } from '@/lib/utils'
import { Skeleton } from '@/ui/skeleton'

export default function CardSkeleton() {
  return <Skeleton className={cn(`h-[7.5rem] w-full rounded-md bg-neutral-300`)} />
}

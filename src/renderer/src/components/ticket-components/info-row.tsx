import { cn } from '@/lib/utils'
import { LucideProps } from 'lucide-react'

export default function InfoRow({
  icon: Icon,
  label,
  children,
  className = ''
}: {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(`grid grid-cols-7 items-center`, className)}>
      <span className="col-span-4 flex w-full flex-row items-center gap-1 text-nowrap font-semibold">
        <Icon className="flex h-5 w-5 dark:text-white/80" />
        <p className="font-semibold dark:text-white/80">{label}</p>
      </span>
      <span className="col-span-3 text-nowrap font-semibold !text-black/40 dark:!text-white/50">
        {children}
      </span>
    </div>
  )
}

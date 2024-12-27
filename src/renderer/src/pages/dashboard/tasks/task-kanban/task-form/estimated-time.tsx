import { Label } from '@/ui/label'

export default function EstimatedTime({
  estimatedTime,
  setEstimatedTime
}: {
  estimatedTime: string
  setEstimatedTime: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div className="flex w-fit flex-col gap-2">
      <Label className="text-nowrap opacity-80">Est time</Label>
      <div className="box-border flex h-[2.5rem] w-fit flex-row items-center rounded-md border border-custom px-1 dark:border-neutral-500 dark:bg-neutral-600">
        <input
          value={estimatedTime}
          onChange={(e) => Number(e.target.value) > -1 && setEstimatedTime(e.target.value)}
          type="number"
          className="h-[fit] w-full text-center text-sm focus:outline-none dark:bg-neutral-600 dark:placeholder:text-white/70"
          placeholder="0"
        />
        <span className="inline-flex text-xs font-light opacity-80 dark:opacity-100">hour</span>
      </div>
    </div>
  )
}

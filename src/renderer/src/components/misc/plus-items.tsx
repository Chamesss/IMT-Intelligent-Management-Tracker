export default function PlusItems({ overflowingTags, className='' }: { overflowingTags: number | string, className?: string }) {
  return (
    <div className={`relative h-[1.4rem] w-[1.4rem] rounded-full bg-black/20 text-xs font-semibold ${className}`}>
      <span className="absolute left-1/2 top-1/2 text-white -translate-x-1/2 -translate-y-1/2">
        +{overflowingTags}
      </span>
    </div>
  )
}

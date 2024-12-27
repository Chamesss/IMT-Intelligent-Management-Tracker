const gray = 'bg-neutral-400/20 text-neutral-400'

export default function Negative({ className }: { className?: string }) {
  return (
    <small
      className={`text-nowrap rounded-xl px-2 py-1 font-semibold capitalize ${gray} ${className}`}
    >
      -
    </small>
  )
}

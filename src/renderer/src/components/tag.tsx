import Negative from './negative'

const colors = [
  'bg-red-400/20 text-red-400',
  'bg-blue-400/20 text-blue-400',
  'bg-green-400/20 text-green-400',
  'bg-purple-400/20 text-purple-400',
  'bg-pink-400/20 text-pink-400',
  'bg-orange-400/20 text-orange-400',
  'bg-teal-400/20 text-teal-400',
  'bg-indigo-400/20 text-indigo-400'
]

export default function Tag({
  tag,
  i,
  className = ''
}: {
  tag: string
  i: number
  className?: string
}) {
  if (!tag || tag.length <= 0) return <Negative />
  if (tag.charAt(0) === '+') {
    return (
      <small
        className={`relative flex h-[1.5rem] w-[1.5rem] items-center justify-center text-nowrap rounded-xl bg-black/20 px-1 py-0.5 font-semibold capitalize text-white ${className}`}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{tag}</span>
      </small>
    )
  }
  return (
    <small
      className={`text-nowrap rounded-xl px-2 py-1 font-semibold capitalize ${colors[i]} ${className}`}
    >
      {tag}
    </small>
  )
}

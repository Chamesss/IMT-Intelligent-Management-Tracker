export const priorityStyles = {
  small: 'bg-low/20 text-low',
  medium: 'bg-medium/20 text-medium',
  high: 'bg-high/20 text-high',
  low: 'bg-low/20 text-low'
}

export default function PriorityLabel({
  priority,
  className
}: {
  priority: string
  className?: string
}) {
  const priorityClass = priorityStyles[priority.toLowerCase()] || 'bg-gray-200 text-gray-700'

  if (priority.length <= 0)
    return (
      <div
        className={`w-fit rounded-lg px-2 py-1 capitalize ${className} ${priorityStyles['medium']}`}
      >
        medium
      </div>
    )

  return (
    <div className={`w-fit rounded-lg px-2 py-1 capitalize ${className} ${priorityClass}`}>
      {priority}
    </div>
  )
}

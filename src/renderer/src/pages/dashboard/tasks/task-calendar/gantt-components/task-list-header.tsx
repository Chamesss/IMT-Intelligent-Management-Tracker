export default function TaskListHeader({ height }: { height: number }) {
  return (
    <div
      style={{ height: height }}
      className="flex w-[200px] flex-row items-center rounded-tl-md border px-4 !transition-all"
    >
      <p>Task Name</p>
    </div>
  )
}

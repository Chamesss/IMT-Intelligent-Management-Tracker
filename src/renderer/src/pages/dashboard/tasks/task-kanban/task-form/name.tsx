import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import React from 'react'

export default function Name({
  name,
  setName
}: {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor="name">Task name</Label>
      <Input
        aria-label="name"
        className="h-[2.5rem] w-full rounded-md"
        size={5}
        placeholder="task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  )
}

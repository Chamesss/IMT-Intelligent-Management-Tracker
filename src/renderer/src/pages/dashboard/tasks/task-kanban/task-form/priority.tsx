import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

export default function Priority({
  priority,
  setPriority
}: {
  priority: string
  setPriority: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div className="flex w-[6rem] flex-col gap-2">
      <Label className="font-light opacity-80" htmlFor="type">
        Priority
      </Label>
      <Select defaultValue="medium" value={priority} onValueChange={(value) => setPriority(value)}>
        <SelectTrigger className="h-[2.5rem] rounded-md text-muted-foreground">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent className="text-green-500">
          <SelectItem className="font-medium text-red-500 focus:text-red-600" value="high">
            High
          </SelectItem>
          <SelectItem className="font-medium text-yellow-500 focus:text-yellow-600" value="medium">
            Medium
          </SelectItem>
          <SelectItem className="font-medium text-neutral-500 focus:text-neutral-600" value="small">
            Small
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

import { Label } from '@/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

export default function TypeTask({
  type,
  setType
}: {
  type: string
  setType: React.Dispatch<React.SetStateAction<string>>
}) {
  return (
    <div className="flex w-[8rem] flex-col gap-2">
      <Label className="font-light opacity-80" htmlFor="type">
        Task type
      </Label>
      <Select defaultValue="normal" value={type} onValueChange={(value) => setType(value)}>
        <SelectTrigger className="h-[2.5rem] w-full rounded-md text-muted-foreground">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent className="text-green-500">
          <SelectItem className="font-medium text-red-500 focus:text-red-600" value="urgent">
            Urgent
          </SelectItem>
          <SelectItem
            className="font-medium text-neutral-500 focus:text-neutral-600"
            value="normal"
          >
            Normal
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

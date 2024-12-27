import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { Switch } from '@/ui/switch'
import { ViewMode } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import React from 'react'

type ViewSwitcherProps = {
  isChecked: boolean
  onViewListChange: (isChecked: boolean) => void
  onViewModeChange: (viewMode: ViewMode) => void
  viewMode: ViewMode
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
  viewMode
}) => {
  return (
    <div className="flex w-full flex-row justify-between gap-4 px-8 py-4">
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <Label className="Switch_Toggle">Show Task List</Label>
          <Switch
            defaultChecked={isChecked}
            onCheckedChange={(checked) => onViewListChange(checked)}
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Button
          className={cn(
            'border border-black bg-white text-black hover:border-neutral-700 hover:bg-neutral-700 hover:text-white',
            viewMode === 'Day' && 'bg-black text-white'
          )}
          onClick={() => onViewModeChange(ViewMode.Day)}
        >
          Day
        </Button>
        <Button
          className={cn(
            'border border-black bg-white text-black hover:border-neutral-700 hover:bg-neutral-700 hover:text-white',
            viewMode === 'Week' && 'bg-black text-white'
          )}
          onClick={() => onViewModeChange(ViewMode.Week)}
        >
          Week
        </Button>
        <Button
          className={cn(
            'border border-black bg-white text-black hover:border-neutral-700 hover:bg-neutral-700 hover:text-white',
            viewMode === 'Month' && 'bg-black text-white'
          )}
          onClick={() => onViewModeChange(ViewMode.Month)}
        >
          Month
        </Button>
      </div>
    </div>
  )
}

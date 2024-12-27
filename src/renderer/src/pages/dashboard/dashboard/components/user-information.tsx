import { useAuth } from '@/hooks/useAuth'
import StatusBoxNewTasks from './status-boxes/status-box-new-tasks'
import StatusBoxTotalHoursDay from './status-boxes/status-box-total-hours-day'
import StatusBoxTotalHoursMonth from './status-boxes/status-box-total-hours-month'
import StatusBoxTotalProjects from './status-boxes/status-box-total-projects'

export default function UserInformation() {
  const { userGlobal }: { userGlobal: userState } = useAuth()
  return (
    <div className="mt-auto flex w-full flex-row gap-4">
      <StatusBoxTotalHoursDay />
      <StatusBoxTotalHoursMonth />
      <StatusBoxNewTasks tasks={userGlobal.totalTasks} />
      <StatusBoxTotalProjects projects={userGlobal.totalProjects} />
    </div>
  )
}

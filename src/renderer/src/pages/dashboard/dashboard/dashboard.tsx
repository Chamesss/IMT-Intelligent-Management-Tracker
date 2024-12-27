import { useLocation } from 'react-router-dom'
import OnGoingProjects from './components/ongoing-projects'
import UserInformation from './components/user-information'

export default function Dashboard() {
  const { state }: { state: string } = useLocation()
  const prevPageNumber = state ? parseInt(state) : 0

  return (
    <div className="flex flex-1 flex-col items-stretch justify-stretch gap-4">
      <UserInformation />
      <OnGoingProjects prevPageNumber={prevPageNumber} />
    </div>
  )
}

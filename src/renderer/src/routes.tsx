import Dashboard from '@/pages/dashboard/dashboard/dashboard'
import Home from '@/pages/home-page'
import ForgetPassword from '@/pages/user-auth/forget-password'
import Login from '@/pages/user-auth/login'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Calendar from './pages/dashboard/calendar/calendar'
import TimeTracking from './pages/dashboard/components/tracker/time-tracking'
import Profile from './pages/dashboard/profile/Profile'
import GanttChart from './pages/dashboard/tasks/task-calendar/gantt-chart'
import KanbanBoard from './pages/dashboard/tasks/task-kanban/kanban'
import Tasks from './pages/dashboard/tasks/tasks'
import ProtectedRoute from './utils/protected-routes'
import UnProtectedRoute from './utils/unprotected-routes'
import UtilitiesLayout from './utils/utilities-layout'

export default function Routing(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route element={<UnProtectedRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<UtilitiesLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route element={<Tasks />}>
              <Route path="/task-kanban" element={<KanbanBoard />} />
              <Route path="/task-calendar" element={<GanttChart />} />
            </Route>
          </Route>
          <Route path="/mini-tracker" element={<TimeTracking />} />
        </Route>
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </HashRouter>
  )
}

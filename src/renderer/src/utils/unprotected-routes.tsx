// unProtectedRoute.tsx
import logo from '@/assets/icon.png'
import Star from '@/assets/login/Star1.svg'
import Transition from '@/components/transition'
import { useAuth } from '@/hooks/useAuth'
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { gradientStyleTopRight } from './gradient'

const UnProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  return !isAuthenticated ? (
    <main className="flex h-screen max-h-screen min-h-[43.75rem] min-w-[84.375rem] items-center justify-start overflow-hidden font-dm dark:bg-black">
      <div
        style={gradientStyleTopRight}
        className="relative w-[931px] self-stretch overflow-hidden rounded-r-[2.5rem]"
      >
        <div className="noisy" />
        <div className="absolute left-1/2 top-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 transform">
          <img src={Star} />
        </div>
      </div>
      <div className="flex w-full min-w-[800px] max-w-[1200px] flex-1 flex-col self-stretch dark:bg-black">
        <header className="mt-0 flex h-20 w-full items-center justify-between bg-white px-[2rem] py-[3rem] dark:bg-black">
          <div className="flex flex-row items-center gap-4">
            <img src={logo} alt="Logo" className="h-[44px] w-[44px] rounded-full" />
            <p className="text-md font-semibold">Intelligent Management Tracker</p>
          </div>
          <div className="flex flex-row gap-4">
            <a className="cursor-pointer text-md text-lightGray hover:underline">License</a>
            <a className="cursor-pointer text-md text-lightGray hover:underline">Terms of Use</a>
          </div>
        </header>
        <Transition className="flex flex-1" trigger={location.pathname}>
          <Outlet />
        </Transition>
        <footer className="flex w-full justify-center py-4 text-[1.125rem] text-lightGray dark:bg-black">
          © 2024 Intelligent Management Tracker. All Rights Reserved.
        </footer>
      </div>
    </main>
  ) : (
    <Navigate to="/dashboard" />
  )
}

export default UnProtectedRoute

import Spinner from '@/components/spinner'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import useNetworkStatus from '@/hooks/useNetworkStatus'
import retryRequest from '@/utils/retry-call'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import ProjectsTable from './projects-table/projects-table'

export default function OnGoingProjects({ prevPageNumber }: { prevPageNumber: number }) {
  const [selectedState, setSelectedState] = useState('All')
  const [currentPage, setCurrentPage] = useState(prevPageNumber)
  const [projects, setProjects] = useState<project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()
  const { isOnline } = useNetworkStatus()
  const api = useAxiosInterceptors()

  useEffect(() => {
    if (isOnline) {
      ;(async () => {
        setLoading(true)
        setError(undefined)
        try {
          const response = await retryRequest(() => api.get('/api/project/project'), 3, 1000)
          setProjects(response.data.projects)
        } catch (e: unknown | AxiosError) {
          if (e instanceof AxiosError) {
            setError(e.response?.data.error)
          } else {
            setError('An error occurred: ' + e)
          }
          //handleError(e, logout)
        } finally {
          setLoading(false)
        }
      })()
    } else {
      setLoading(false)
      setError('No internet connection')
    }
  }, [isOnline])

  const handleTagChange = (tag: string) => {
    setSelectedState(tag)
    setCurrentPage(0)
  }

  return (
    <div className="flex h-full w-auto flex-col items-center justify-start rounded-lg border-[0.12rem] border-custom bg-white dark:border-neutral-900 dark:bg-neutral-800">
      <div className="flex w-full flex-row items-stretch justify-between px-6 pt-4">
        <div className="flex w-full">
          <h1 className="my-auto text-2xl font-bold capitalize">Ongoing projects</h1>
        </div>
        <div className="relative box-content flex h-[1.25rem] w-auto min-w-[22rem] flex-row justify-between gap-6 overflow-hidden rounded-2xl border border-custom p-4 px-8 text-base text-mediumGray dark:border-neutral-600">
          <h3
            onClick={() => handleTagChange('All')}
            className={`absolute right-[86%] top-1/2 box-content -translate-y-1/2 cursor-pointer font-medium transition-all hover:brightness-125 ${selectedState === 'All' ? 'font-semibold text-black dark:text-white' : ''} ${projects.length === 0 && loading === false && 'pointer-events-none'}`}
          >
            All
          </h3>
          <h3
            onClick={() => handleTagChange('Completed')}
            className={`absolute right-[58%] top-1/2 box-content -translate-y-1/2 cursor-pointer font-medium transition-all hover:brightness-125 ${selectedState === 'Completed' ? 'font-semibold text-black dark:text-white' : ''} ${projects.length === 0 && loading === false && 'pointer-events-none'}`}
          >
            Completed
          </h3>
          <h3
            onClick={() => handleTagChange('Ongoing')}
            className={`absolute right-[32%] top-1/2 box-content -translate-y-1/2 cursor-pointer font-medium transition-all hover:brightness-125 ${selectedState === 'Ongoing' ? 'font-semibold text-black dark:text-white' : ''} ${projects.length === 0 && loading === false && 'pointer-events-none'}`}
          >
            Ongoing
          </h3>
          <h3
            onClick={() => handleTagChange('Blocked')}
            className={`absolute right-[9%] top-1/2 box-content -translate-y-1/2 cursor-pointer font-medium transition-all hover:brightness-125 ${selectedState === 'Blocked' ? 'font-semibold text-black dark:text-white' : ''} ${projects.length === 0 && loading === false && 'pointer-events-none'}`}
          >
            Blocked
          </h3>
          <div
            className={`absolute bottom-0 h-1 rounded-full bg-black transition-all duration-300 ease-in-out dark:bg-white ${selectedState === 'All' ? 'right-[80%] !w-[15%]' : ''} ${selectedState === 'Completed' ? 'right-[55%] !w-[25%]' : ''} ${selectedState === 'Ongoing' ? 'right-[27%] !w-[25%]' : ''} ${selectedState === 'Blocked' ? 'right-[4%] !w-[25%]' : ''}`}
          />
        </div>
      </div>
      <div className="flex min-h-[25rem] w-full flex-1">
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner className="h-10 w-10 !border-black !border-b-transparent dark:!border-white dark:!border-b-transparent" />
          </div>
        ) : (
          <>
            {error ? (
              <div className="flex h-full w-full items-center justify-center">{error}</div>
            ) : (
              <ProjectsTable
                tag={selectedState}
                projects={projects}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

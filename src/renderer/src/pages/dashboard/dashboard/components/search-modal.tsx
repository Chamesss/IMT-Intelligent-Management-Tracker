import Spinner from '@/components/spinner'
import { useAxiosInterceptors } from '@/hooks/useAxiosInterceptor'
import { cn } from '@/lib/utils'
import { DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog'
import { gradientStyle } from '@/utils/gradient'
import { debounce } from 'lodash' // Import lodash debounce
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import MessageSelection from './search-components/message-selection'
import ProjectSelection from './search-components/project-selection'
import TaskSelection from './search-components/task-selection'

export default function SearchModal({
  setSearchOpen
}: {
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<searchResultType | null>()
  const [loading, setLoading] = useState(false)
  const api = useAxiosInterceptors()

  const fetchResults = debounce(async (searchTerm: string) => {
    if (searchTerm.length > 0) {
      setLoading(true)
      try {
        const response = await api.get('/api/project/search', {
          params: {
            name: searchTerm
          }
        })
        console.log(response.data)
        const result: searchResultType = response.data
        if (
          result.projects.length === 0 &&
          result.tasks.length === 0 &&
          result.messages.length === 0
        ) {
          setSearchResults(null)
        } else {
          setSearchResults(() => {
            const sortedMessagesByDate = result.messages.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            return {
              projects: result.projects,
              tasks: result.tasks,
              messages: sortedMessagesByDate
            }
          })
        }
      } catch (e) {
        console.log(e)
        //handleError(e, logout)
      } finally {
        setLoading(false)
      }
    } else {
      setSearchResults(() => undefined)
    }
  }, 300)

  useEffect(() => {
    fetchResults(search)
    return () => {
      fetchResults.cancel()
    }
  }, [search])

  return (
    <React.Fragment>
      <DialogHeader className="rounded-b-xl bg-white dark:bg-neutral-900">
        <DialogTitle className="mt-4 flex flex-row items-center justify-center gap-2 px-4 py-1">
          <div
            style={gradientStyle}
            className="absolute left-1/2 top-0 h-[1rem] w-full -translate-x-1/2 rounded-t-lg"
          >
            <div className="noisy" />
          </div>{' '}
          <Search className="h-5 w-5 opacity-50" />
          <input
            className="h-[3rem] w-full rounded-none border-none text-sm font-normal focus:!border-none focus:!outline-none focus:!ring-0 dark:bg-neutral-900"
            placeholder="Type a project or task name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </DialogTitle>
      </DialogHeader>
      <div
        id="search-results"
        className={cn(
          '-mt-3 h-[25rem] rounded-t-xl bg-white px-4 pb-10 pt-2 transition-all duration-500 ease-in-out dark:bg-neutral-900'
        )}
      >
        {!loading && searchResults === undefined && (
          <div className="flex h-full flex-1 items-center justify-center">
            <p className="font-semibold">Type to search.</p>
          </div>
        )}
        {loading ? (
          <div className="flex h-full flex-1 items-center justify-center">
            <Spinner className="!border-black !border-t-transparent dark:!border-white dark:!border-t-transparent" />
          </div>
        ) : (
          <React.Fragment>
            <DialogDescription className="px-2 text-sm drop-shadow-none">
              {!loading && searchResults === undefined ? '' : 'Search results'}
            </DialogDescription>
            <div className="scrollbar flex h-full flex-1 flex-col overflow-auto">
              {searchResults === null && (
                <div className="flex h-full flex-1 items-center justify-center">
                  <p className="font-semibold">No result found.</p>
                </div>
              )}
              {searchResults && searchResults.projects.length > 0 && (
                <ProjectSelection searchResults={searchResults} setSearchOpen={setSearchOpen} />
              )}
              {searchResults && searchResults.tasks.length > 0 && (
                <TaskSelection searchResults={searchResults} setSearchOpen={setSearchOpen} />
              )}
              {searchResults && searchResults.messages.length > 0 && (
                <MessageSelection searchResults={searchResults} setSearchOpen={setSearchOpen} />
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}

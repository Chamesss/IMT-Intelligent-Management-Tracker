import ProjectSvg from '@/assets/misc/project-svg'
import { FolderOpen } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  searchResults: searchResultType
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ProjectSelection({ searchResults, setSearchOpen }: Props) {
  const navigate = useNavigate()
  return (
    <React.Fragment>
      <p className="my-2 px-2 font-semibold text-muted-foreground dark:text-white/80">
        <FolderOpen className="mb-0.5 mr-0.5 inline-block h-5 w-5 dark:text-white/80" /> In Projects
      </p>

      {searchResults?.projects.map((project) => (
        <div
          key={project._id}
          className="group mt-1 flex cursor-pointer flex-row items-center px-1"
        >
          <div
            onClick={() => {
              navigate('/task-kanban', {
                state: {
                  projectId: project._id,
                  pageNumber: 0,
                  projectName: project.name
                }
              })
              setSearchOpen(false)
            }}
            className="w-full rounded-sm border border-black/5 bg-black/5 dark:border px-3 py-4 dark:bg-neutral-800 dark:border-neutral-700 dark:group-hover:bg-neutral-700 group-hover:bg-black/10"
          >
            <div className="flex flex-row items-center justify-start gap-1.5 text-base font-semibold group-hover:underline">
              <ProjectSvg className="inline-block h-6 w-6" />
              <p>{project.name}</p>
            </div>
          </div>
        </div>
      ))}
    </React.Fragment>
  )
}

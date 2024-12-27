import ProjectSvg from '@/assets/misc/project-svg'
import GetUserNamePic from '@/components/misc/get-user-name-pic'
import Negative from '@/components/negative'
import PriorityLabel from '@/components/priority'
import Tag from '@/components/tag'
import InfoRow from '@/components/ticket-components/info-row'
import { Button } from '@/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/ui/sheet'
import calculateDaysFromHours from '@/utils/calculate-days-from-hours'
import { formatDate } from '@/utils/date-formatter'
import { gradientStyle } from '@/utils/gradient'
import {
  Clock,
  ExternalLink,
  Eye,
  FlagTriangleLeft,
  Info,
  Star,
  TrendingUp,
  UserRound
} from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProjectSheet({
  currentPage,
  project
}: {
  currentPage: number
  project: project
}) {
  const [open, setIsOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <div>
      <Eye
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-5 w-5 cursor-pointer text-gray-400 transition-all hover:text-gray-400/80"
      />
      <Sheet open={open} onOpenChange={setIsOpen}>
        <SheetContent className="flex min-w-[35vw] flex-col items-center justify-between bg-white dark:border-neutral-600 dark:bg-neutral-800">
          <SheetHeader className="w-full space-y-8">
            <SheetTitle
              style={gradientStyle}
              className="relative rounded-xl border border-gray-200 p-4 dark:border-gray-600"
            >
              <div className="noisy" />
              <div className="z-[1] flex w-full items-center gap-2">
                <ProjectSvg className="mt-1 h-6 w-6 fill-white" />
                <span className="text-lg text-white">{project.name}</span>
              </div>
            </SheetTitle>
            <SheetDescription className="flex flex-col !items-start gap-2 rounded-2xl bg-muted p-4 dark:bg-neutral-700">
              <div className="mb-2 flex flex-row items-center gap-2 px-1 text-base font-semibold text-gray-800">
                <Info className="mt-0 h-5 w-5 text-neutral-600 dark:text-white" />
                <span className="dark:text-white">Project Description:</span>
              </div>
              <span className="w-full px-2 dark:text-white">
                {project.description || <Negative className="!mx-auto" />}
              </span>
            </SheetDescription>
            <hr className="dark:border-neutral-600" />
            <div className="text-sm text-neutral-500">
              <div className="grid grid-cols-2 items-center">
                <InfoRow className="items-center px-2" icon={TrendingUp} label="Status">
                  <div
                    className={`text-sm font-bold capitalize ${
                      {
                        'in progress': 'text-inProgress',
                        'in review': 'text-inReview',
                        blocked: 'text-blocked'
                      }[project.status.toLowerCase()] || ''
                    }`}
                  >
                    <div className="flex flex-row items-center gap-2">{project.status}</div>
                  </div>
                </InfoRow>
              </div>
            </div>
            <hr className="dark:border-neutral-600" />
            <div className="px-2 text-sm text-neutral-500">
              <div className="grid grid-cols-2 gap-3">
                <InfoRow className="items-center" icon={Clock} label="Created At">
                  {formatDate(project.createdAt) || '-'}
                </InfoRow>
                <InfoRow className="items-center" icon={FlagTriangleLeft} label="Dead Line">
                  {/* @ts-ignore */}
                  {formatDate(project?.deadline) || '-'}
                </InfoRow>
                <InfoRow className="items-center" icon={Star} label="Priority">
                  <PriorityLabel priority={project.priority} />
                </InfoRow>

                <InfoRow className="items-center" icon={Clock} label="Est. Time">
                  {calculateDaysFromHours(project.estimatedTime, project.isIA)}
                </InfoRow>

                <InfoRow className="items-start" icon={UserRound} label="Members">
                  <div className="flex flex-row flex-wrap gap-1">
                    {/* @ts-ignore */}
                    {project.membres.length > 0 ? (
                      <React.Fragment>
                        {/* @ts-ignore */}
                        {project.membres.map((user: string, i: number) => (
                          <GetUserNamePic key={i} userId={user} index={i} />
                        ))}
                      </React.Fragment>
                    ) : (
                      <Negative />
                    )}
                  </div>
                </InfoRow>

                <InfoRow className="items-start" icon={FlagTriangleLeft} label="Tags">
                  <span className="flex w-fit flex-row flex-wrap gap-1">
                    {project.tags.length > 0 &&
                      project.tags.map((tag, i) => <Tag key={i} tag={tag} i={i} />)}
                  </span>
                </InfoRow>
              </div>
            </div>
          </SheetHeader>
          <Button
            onClick={() =>
              navigate('/task-kanban', {
                state: {
                  projectId: project._id,
                  pageNumber: currentPage,
                  projectName: project.name
                }
              })
            }
            className="flex flex-row items-center gap-2 self-start bg-black"
          >
            <span className="text-white">Go to project</span>
            <ExternalLink className="h-5 w-5 text-white" />
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  )
}

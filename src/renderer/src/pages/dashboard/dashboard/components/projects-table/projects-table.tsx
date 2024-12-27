import EmptyFolder from '@/assets/misc/empty'
import PlusItems from '@/components/misc/plus-items'
import PriorityLabel from '@/components/priority'
import Tag from '@/components/tag'
import Transition from '@/components/transition'
import { tableHead } from '@/lib/constants'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip'
import { formatDate } from '@/utils/date-formatter'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from './pagination'
import ProjectSheet from './project-sheet'

const ITEMS_PER_PAGE = 5 // Number of items per page

export default function ProjectsTable({
  tag,
  projects,
  currentPage,
  setCurrentPage
}: {
  tag: string
  projects: project[]
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}) {
  const navigate = useNavigate()

  if (projects.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <EmptyFolder className="h-[4rem] w-[4rem] opacity-50" />
        <p className="italic opacity-50">No Projects to display</p>
      </div>
    )
  }

  const itemsToSlice = projects.filter((p) => {
    if (tag === 'All') return true
    if (tag === 'Completed') return p.status.toLowerCase() === 'in review'
    if (tag === 'Ongoing') return p.status.toLowerCase() === 'in progress'
    if (tag === 'Blocked') return p.status.toLowerCase() === 'blocked'
    return false
  })

  const pageCount = Math.ceil(itemsToSlice.length / ITEMS_PER_PAGE)

  const displayItems = itemsToSlice.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  return (
    <div className="mt-10 flex w-full flex-col justify-between">
      <div className="flex flex-1 overflow-x-auto">
        <Transition className="flex w-full flex-1" trigger={displayItems.length}>
          <table className="relative min-w-full divide-y divide-gray-200 overflow-hidden dark:divide-neutral-900">
            <thead>
              <tr>
                {tableHead.map((head, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="px-4 py-2 text-left text-sm font-medium capitalize text-mediumGray"
                    style={{ width: i === 0 ? '15%' : i === tableHead.length - 1 ? '15%' : 'auto' }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="dark:divide-neutral-00 h-full divide-y divide-gray-200 bg-white dark:divide-neutral-950 dark:border-neutral-900 dark:bg-neutral-800">
              {displayItems.length > 0 ? (
                <React.Fragment>
                  {displayItems.map((item, i) => {
                    let tags: string[] = []
                    let overflowingTags = 0
                    if (item.tags.length > 2) {
                      tags.push(item.tags[0])
                      tags.push(item.tags[1])
                      overflowingTags = item.tags.length - 2
                    } else {
                      tags = item.tags
                    }
                    return (
                      <React.Fragment key={i}>
                        <tr className="relative h-[20%] transition-all hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td className="max-w-[15rem] px-4 py-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    onClick={() =>
                                      navigate('/task-kanban', {
                                        state: {
                                          projectId: item._id,
                                          pageNumber: currentPage,
                                          projectName: item.name
                                        }
                                      })
                                    }
                                    className="cursor-pointer truncate text-base font-medium hover:underline"
                                  >
                                    {item.name}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>{item.name}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </td>
                          <td className="whitespace-nowrap px-4 py-2">
                            <div
                              className={`text-sm font-bold capitalize ${
                                {
                                  'in progress': 'text-inProgress',
                                  'in review': 'text-inReview',
                                  blocked: 'text-blocked'
                                }[item.status.toLowerCase()] || ''
                              }`}
                            >
                              {item.status}
                            </div>
                          </td>
                          <td className="text-dm whitespace-nowrap px-4 py-2 text-sm font-medium">
                            <PriorityLabel priority={item.priority} />
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-sm">
                            <div className="text-base">
                              {item.startDate ? formatDate(item.startDate) : '-'}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-sm">
                            <div className="w-fit rounded-lg bg-mediumGray/10 p-2 text-base text-mediumGray">
                              {item.estimatedTime ? item.estimatedTime + ' Days' : '-'}
                            </div>
                          </td>
                          {/* <td className="whitespace-nowrap px-4 py-2 text-sm">
                            <div className="w-fit rounded-lg bg-mediumGray/10 p-2 text-base">
                              {item.timeTracked} hours
                            </div>
                          </td> */}
                          {/* <td className="whitespace-nowrap px-4 py-2 text-sm">
                          <div
                            className={`w-fit rounded-lg bg-mediumGray/10 px-[0.85rem] py-2 text-base font-bold ${
                              item.overtime === '0' ? 'text-mediumGray' : 'text-[#FF5C00]'
                            }`}
                          >
                            {item.overtime === '0' ? '-' : `+${item.overtime} hours`}
                          </div>
                          </td> */}
                          <td className="relative my-auto w-1/5 flex-nowrap gap-2 px-2 py-2 text-[0.9rem]">
                            <span className="flex flex-row flex-nowrap items-center justify-between">
                              <span className="flex flex-row flex-nowrap items-center gap-0.5">
                                {tags.map((tag, i) => (
                                  <Tag key={i} tag={tag} i={i} />
                                ))}
                                {overflowingTags > 0 && (
                                  <PlusItems
                                    className="inline-block"
                                    overflowingTags={overflowingTags}
                                  />
                                )}
                              </span>
                              <div className="mr-2">
                                <ProjectSheet currentPage={currentPage} project={item} />
                              </div>
                            </span>
                          </td>
                        </tr>
                      </React.Fragment>
                    )
                  })}

                  {Array.from({ length: Math.max(5 - displayItems.length, 0) }).map((_, i) => (
                    <div key={i} className="h-[20%] w-[0]">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="bg-red-200 px-4 py-2 opacity-0">
                          {' '}
                        </td>
                      ))}
                    </div>
                  ))}
                </React.Fragment>
              ) : (
                <tr className="absolute top-1/2 flex h-fit w-full flex-1 -translate-y-1/2 flex-col items-center justify-center gap-4">
                  <EmptyFolder className="h-[4rem] w-[4rem] opacity-50" />
                  <p className="italic opacity-50">No Projects to display</p>
                </tr>
              )}
            </tbody>
          </table>
        </Transition>
      </div>
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageCount={pageCount} />
    </div>
  )
}

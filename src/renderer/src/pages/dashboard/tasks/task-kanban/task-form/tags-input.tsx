import { cn } from '@/lib/utils'
import { Badge } from '@/ui/badge'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function MultipleTagsSelection({
  selectedTags,
  setSelectedTags
}: {
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const [tag, setTag] = useState<string>('')
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [exampleTags] = useState<string[]>([
    'Web Development',
    'Mobile Development',
    'Artificial Intelligence',
    'Deep Learning',
    'Frontend Development',
    'Backend Development',
    'Fullstack Development',
    'UI/UX Design',
    'DevOps'
  ])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (isFocused) {
        const scrollableContainer = document.getElementById('scrollable-container')
        if (scrollableContainer) {
          scrollableContainer.scrollTo({
            top: 1000,
            behavior: 'smooth'
          })
        }
      }
    }, 500)
  }, [isFocused])

  return (
    <div
      ref={containerRef}
      className="flex w-full flex-col gap-2"
      onFocus={() => setIsFocused(true)}
    >
      <Label htmlFor="type">Tags</Label>
      <Input
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (tag === '') return
            setSelectedTags([...selectedTags, tag])
            setTag('')
          }
        }}
        className="h-[2.5rem] w-full rounded-md"
        placeholder='Press "Enter" to add a tag'
      />
      <div className="flex h-full min-h-[3rem] w-full flex-row flex-nowrap items-center gap-1 overflow-x-scroll py-1">
        {selectedTags.map((tag, index) => (
          <Badge
            key={index}
            className="cursor-pointer text-nowrap rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-800 hover:text-white"
          >
            {tag}
            <X
              onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
              className="mb-[0.05rem] ml-1 inline-block h-4 w-4 cursor-pointer text-red-400 hover:text-red-500"
            />
          </Badge>
        ))}
        {selectedTags.length === 0 && (
          <h6 className="w-full text-center text-sm font-thin italic text-gray-500">
            No tags added yet
          </h6>
        )}
      </div>
      <div
        className={cn(
          'xs:h-[15rem] h-[20rem] overflow-hidden rounded-lg bg-gray-50 px-3 py-2 transition-all duration-500 ease-in-out sm:h-[17rem] xl:h-[15rem]',
          {
            '!h-0 py-0': !isFocused || exampleTags.length === 0
          }
        )}
      >
        <Label className="cursor-text">Example tags</Label>
        <ul className="space-y-1">
          {exampleTags.map((tag, index) => (
            <Badge
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  return
                }
                setSelectedTags([...selectedTags, tag])
                // setExampleTags(exampleTags.filter((t) => t !== tag))
              }}
              key={index}
              className={cn(
                'mr-2 cursor-pointer text-nowrap rounded-full bg-gray-200 px-2 py-1 text-sm text-gray-800 hover:text-white',
                {
                  'bg-black/50 text-white': selectedTags.includes(tag)
                }
              )}
            >
              {tag}
            </Badge>
          ))}
        </ul>
      </div>
    </div>
  )
}

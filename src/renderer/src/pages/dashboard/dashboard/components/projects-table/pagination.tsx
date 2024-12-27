type Props = {
  currentPage: number
  setCurrentPage: (page: number) => void
  pageCount: number
}

export default function Pagination({ currentPage, setCurrentPage, pageCount }: Props) {
  return (
    <div className="flex justify-center gap-2 px-1 pb-2 mt-2">
      <div
        onClick={() => setCurrentPage(0)}
        className={`flex cursor-pointer items-center justify-center rounded-lg border border-custom px-3 py-1.5 text-[0.914rem] transition-all hover:bg-black hover:text-white dark:border-black dark:bg-black dark:hover:bg-white dark:hover:text-black ${currentPage === 0 && 'pointer-events-none border-zinc-100 bg-zinc-100 text-zinc-300 dark:border-neutral-600 dark:bg-neutral-500 dark:text-neutral-600'}`}
      >
        &lt;&lt;
      </div>
      <div
        onClick={() => setCurrentPage(currentPage - 1)}
        className={`flex cursor-pointer items-center justify-center rounded-lg border border-custom px-3 py-1.5 text-[0.914rem] transition-all hover:bg-black hover:text-white dark:border-black dark:bg-black dark:hover:bg-white dark:hover:text-black ${currentPage === 0 && 'pointer-events-none border-zinc-100 bg-zinc-100 text-zinc-300 dark:border-neutral-600 dark:bg-neutral-500 dark:text-neutral-600'}`}
      >
        &lt;
      </div>
      {Array.from({ length: pageCount }).map((_, i) => (
        <div
          onClick={() => setCurrentPage(i)}
          className={`flex cursor-pointer items-center justify-center rounded-lg border border-custom px-3 py-1.5 text-[0.914rem] transition-all dark:border-black dark:bg-black dark:hover:bg-white dark:hover:text-black ${currentPage === i && 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'} `}
          key={i}
        >
          {i + 1}
        </div>
      ))}
      <div
        onClick={() => setCurrentPage(currentPage + 1)}
        className={`flex cursor-pointer items-center justify-center rounded-lg border border-custom px-3 py-1.5 text-[0.914rem] transition-all hover:bg-black hover:text-white dark:border-black dark:bg-black dark:hover:bg-white dark:hover:text-black ${(currentPage === pageCount - 1 || pageCount === 0) && 'pointer-events-none border-zinc-100 bg-zinc-100 text-zinc-300 dark:border-neutral-600 dark:bg-neutral-500 dark:text-neutral-600'}`}
      >
        &gt;
      </div>
      <div
        onClick={() => setCurrentPage(pageCount - 1)}
        className={`flex cursor-pointer items-center justify-center rounded-lg border border-custom px-3 py-1.5 text-[0.914rem] transition-all hover:bg-black hover:text-white dark:border-black dark:bg-black dark:hover:bg-white dark:hover:text-black ${(currentPage === pageCount - 1 || pageCount === 0) && 'pointer-events-none border-zinc-100 bg-zinc-100 text-zinc-300 dark:border-neutral-600 dark:bg-neutral-500 dark:text-neutral-600'}`}
      >
        &gt;&gt;
      </div>
    </div>
  )
}

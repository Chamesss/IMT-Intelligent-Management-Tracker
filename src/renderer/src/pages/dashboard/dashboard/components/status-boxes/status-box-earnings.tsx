import icon from '@/assets/dashboard/status/chart.svg'

export default function StatusBoxEarnings() {
  return (
    <div className="flex h-[7rem] w-full items-center justify-center rounded-lg border-[0.12rem] border-custom bg-white px-4 dark:border-neutral-900 dark:bg-neutral-800">
      <div className="flex w-full flex-row items-center justify-start gap-4">
        <div className="flex h-[3rem] w-[3rem] rounded-full bg-[#F7F7F7] p-3">
          <img src={icon} alt="earnings" />
        </div>
        <div>
          <p className="text-sm text-mediumGray">Earnings</p>
          <p className="text-[1.5rem] font-bold">$335.4</p>
        </div>
      </div>
    </div>
  )
}

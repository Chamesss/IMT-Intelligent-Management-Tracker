import IconDoc from '@/assets/files/iconDoc'
import IconFile from '@/assets/files/iconFile'
import IconPdf from '@/assets/files/iconPdf'
import IconPic from '@/assets/files/iconPic'
import IconPpt from '@/assets/files/iconPpt'
import IconTxt from '@/assets/files/iconTxt'
import IconXls from '@/assets/files/iconXls'
import IconZip from '@/assets/files/iconZip'

import { X } from 'lucide-react'

export default function FileTooltip({
  file,
  setFiles
}: {
  file: File
  setFiles: React.Dispatch<React.SetStateAction<FileList | null>>
}) {
  const renderFilePreview = (file: File) => {
    const fileType = file.type
    const fileName = file.name.toLowerCase()

    if (fileType.startsWith('image/') || fileName.endsWith('.svg')) {
      return renderIconPreview(<IconPic className="h-4 w-4" />, file.name)
    } else if (fileType === 'application/pdf') {
      return renderIconPreview(<IconPdf className="h-4 w-4" />, file.name)
    } else if (
      [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ].includes(fileType)
    ) {
      return renderIconPreview(<IconDoc className="h-4 w-4" />, file.name)
    } else if (
      [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ].includes(fileType) ||
      fileName.endsWith('.csv') ||
      fileName.endsWith('.tsv')
    ) {
      return renderIconPreview(<IconXls className="h-4 w-4" />, file.name)
    } else if (
      [
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ].includes(fileType)
    ) {
      return renderIconPreview(<IconPpt className="h-4 w-4" />, file.name)
    } else if (
      [
        'application/zip',
        'application/x-rar-compressed',
        'application/x-7z-compressed',
        'application/x-tar',
        'application/gzip'
      ].includes(fileType)
    ) {
      return renderIconPreview(<IconZip className="h-4 w-4" />, file.name)
    } else if (['text/plain', 'application/rtf'].includes(fileType)) {
      return renderIconPreview(<IconTxt className="h-4 w-4" />, file.name)
    } else {
      return renderIconPreview(<IconFile className="h-4 w-4" />, file.name)
    }
  }

  const renderIconPreview = (IconSrc: JSX.Element, fileName: string) => {
    return (
      <div className="flex items-center gap-2">
        {IconSrc}
        <span>{fileName}</span>
      </div>
    )
  }

  const handleDeleteFile = () => {
    setFiles((prev: FileList | null) => {
      if (prev && prev.length > 0) {
        const files = Array.from(prev)
        const updatedFile = files.filter((f) => f !== file)
        if (updatedFile.length <= 0) {
          return null
        }
        const dataTransfer = new DataTransfer()
        updatedFile.forEach((file) => dataTransfer.items.add(file))
        return dataTransfer.files
      } else {
        return null
      }
    })
  }

  return (
    <div className="w-fit p-0">
      <div className="relative flex flex-row items-center gap-2">
        <X
          onClick={handleDeleteFile}
          className="h-[1.2rem] w-[1.2rem] cursor-pointer rounded-md bg-black/20 p-[1px] text-white hover:bg-black/40"
        />
        {renderFilePreview(file)}
      </div>
    </div>
  )
}

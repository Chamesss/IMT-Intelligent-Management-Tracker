import IconDoc from '@/assets/files/iconDoc'
import IconFile from '@/assets/files/iconFile'
import IconPdf from '@/assets/files/iconPdf'
import IconPpt from '@/assets/files/iconPpt'
import IconTxt from '@/assets/files/iconTxt'
import IconXls from '@/assets/files/iconXls'
import IconZip from '@/assets/files/iconZip'

import PhotoLoader from './photo-loader'

export default function FileDisplay({ comment }: { comment: comments }) {
  const Render = (file: { file: string; fileType: string; fileName: string }) => {
    console.log('file = ', file)
    switch (file.fileType) {
      case 'application/pdf':
        return (
          <div className="flex flex-row items-center gap-0.5">
            <IconPdf className="h-4 w-4" />
            <a href={file.file} target="_blank" rel="noreferrer" className="hover:underline">
              {file.fileName}
            </a>
          </div>
        )
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
      case 'application/vnd.oasis.opendocument.text':
        return (
          <div className="flex flex-row items-center gap-0.5">
            <IconDoc className="h-4 w-4" />
            <a href={file.file} target="_blank" rel="noreferrer" className="hover:underline">
              {file.fileName}
            </a>
          </div>
        )
      case 'text/plain':
        return (
          <div className="flex flex-row items-center gap-0.5">
            <IconTxt className="h-4 w-4" />
            <a href={file.file} target="_blank" rel="noreferrer" className="hover:underline">
              {file.fileName}
            </a>
          </div>
        )
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return (
          <div className="flex flex-row items-center gap-0.5">
            <IconXls className="h-4 w-4" />
            <a href={file.file} target="_blank" rel="noreferrer" className="hover:underline">
              {file.fileName}
            </a>
          </div>
        )
      case 'application/x-zip-compressed':
      case 'application/zip':
        return (
          <div className="flex flex-row items-center gap-0.5">
            <IconZip className="h-4 w-4" />
            <a href={file.file} target="_blank" rel="noreferrer" className="hover:underline">
              {file.fileName}
            </a>
          </div>
        )
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return (
          <div className="flex flex-row items-center gap-0.5">
            <IconPpt className="h-4 w-4" />
            <a href={file.file} target="_blank" rel="noreferrer" className="hover:underline">
              {file.fileName}
            </a>
          </div>
        )

      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
      case 'image/webp':
        return <PhotoLoader file={file} />
      default:
        return <IconFile className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col gap-2 italic">
      {comment.files.map((file, index) => {
        const ToRender = Render(file)
        return <div key={index}>{ToRender}</div>
      })}
    </div>
  )
}

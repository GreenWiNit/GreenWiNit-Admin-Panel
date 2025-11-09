import React, { useRef } from 'react'
import { imagesApi } from '@/api/images'
import { Plus as PlusIcon, X as XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/shadcn/button'

type InputImageMultipleProps = {
  value: string[]
  purpose: Parameters<typeof imagesApi.uploadImage>[0]
  onChange: (urls: string[]) => void
  maxImages?: number
  className?: string
}

const InputImageMultiple = ({
  value = [],
  purpose,
  onChange,
  maxImages = 10,
  className,
}: InputImageMultipleProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const isReadOnly = !onChange

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - value.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    for (const file of filesToUpload) {
      try {
        const res = await imagesApi.uploadImage(purpose, file)
        if (res.success) {
          onChange([...value, res.result])
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error)
      }
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index)
    onChange(newImages)
  }

  const canAddMore = value.length < maxImages

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {/* 등록된 이미지들 */}
      {value.map((url, index) => (
        <div key={index} className="group relative">
          <img
            src={url}
            alt={`이미지 ${index + 1}`}
            className="h-48 w-48 rounded-lg border object-cover"
          />
          {!isReadOnly && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="bg-ring absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-80"
              onClick={() => handleRemove(index)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {/* 이미지 추가 버튼 */}
      {!isReadOnly && canAddMore && (
        <div
          className="flex h-48 w-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
          onClick={() => inputRef.current?.click()}
        >
          <div className="rounded-full border-2 border-[#3A9B6E] p-2">
            <PlusIcon className="h-5 w-5 text-[#3A9B6E]" />
          </div>
          <span className="text-xs text-gray-600">이미지 추가</span>
          <span className="text-xs text-gray-400">
            {value.length}/{maxImages}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}

export default InputImageMultiple

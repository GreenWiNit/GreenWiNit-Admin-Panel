import React, { Fragment, useRef, useState, type ComponentProps, type ForwardedRef } from 'react'
import { imagesApi } from '@/api/images'
import { Plus as PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { omit } from 'es-toolkit'

interface InputComponentProps extends Omit<ComponentProps<'input'>, 'src' | 'value' | 'onChange'> {
  localFileName: string | null
  onChange: (src: string | null) => void
  onChangePreview?: (src: string) => void
  purpose: Parameters<typeof imagesApi.uploadImage>[0]
}

function InputComponent({ onChange, onChangePreview, purpose, ...restProps }: InputComponentProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const processingObjectURL = URL.createObjectURL(file)
      onChangePreview?.(processingObjectURL)
      imagesApi.uploadImage(purpose, file).then((res) => {
        URL.revokeObjectURL(processingObjectURL)
        if (!res.success) {
          return
        }
        onChange(res.result)
      })
    }
  }

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      {...omit(restProps, ['localFileName'])}
      value={restProps.localFileName ?? undefined}
      className={cn(restProps.className, 'cursor-pointer')}
    />
  )
}

type InputImageProps = Omit<React.ComponentProps<'input'>, 'value' | 'onChange'> & {
  value: string | null
  purpose: Parameters<typeof InputComponent>[0]['purpose']
  onChange: (src: string | null) => void
}

const InputImage = (props: InputImageProps) => {
  const source = props.value
  const [preview, setPreview] = useState<string | null>(source)
  const inputRef = useRef<HTMLInputElement>(
    props.ref && typeof props.ref === 'object' && 'current' in props.ref ? props.ref.current : null,
  )
  const mergedRef = mergeRefs(props.ref, inputRef)

  return (
    <div
      className={cn(
        'flex min-h-[15vh] w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl',
        preview == null ? 'bg-[#f0f0f0] p-8' : 'max-h-[20vh]',
      )}
      onClick={() => inputRef.current?.click()}
    >
      {!preview ? (
        <Fragment>
          <div className="rounded-full border-[2px] border-[#3A9B6E] p-2">
            <PlusIcon className="text-[#3A9B6E]" />
          </div>
          <span className="text-bold text-[#666666]">이미지를 업로드 해주세요.</span>
          <span className="text-sm text-[#999999]">권장 크기: 1200 x 800px</span>
        </Fragment>
      ) : (
        <img src={preview} alt="uploaded" className="min-h-[15vh]" />
      )}
      <InputComponent
        {...omit(props, ['value'])}
        localFileName={
          source &&
          (source?.startsWith('file://') || source?.startsWith('blob:') || source?.startsWith('/'))
            ? source
            : null
        }
        onChangePreview={setPreview}
        onChange={props.onChange}
        purpose={props.purpose}
        ref={mergedRef}
        onClick={(e) => {
          e.stopPropagation()
        }}
      />
    </div>
  )
}

function mergeRefs<T>(...refs: (ForwardedRef<T> | undefined)[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    })
  }
}

export default InputImage

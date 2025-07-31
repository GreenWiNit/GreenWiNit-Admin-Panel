import { cn } from '@/lib/utils'
import type { ComponentProps, PropsWithChildren } from 'react'

type PageContainerProps = PropsWithChildren<ComponentProps<'div'>>
const PageContainer = ({ children, ...props }: PageContainerProps) => {
  return (
    <div {...props} className={cn('flex w-full flex-row gap-4 p-8', props.className)}>
      {children}
    </div>
  )
}

export default PageContainer

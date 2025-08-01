import { cn } from '@/lib/utils'
import type { ComponentProps, PropsWithChildren } from 'react'

type PageTitleProps = PropsWithChildren<ComponentProps<'h1'>>
const PageTitle = ({ children, ...props }: PageTitleProps) => {
  return (
    <h1 {...props} className={cn('self-start text-2xl font-bold', props.className)}>
      {children}
    </h1>
  )
}

export default PageTitle

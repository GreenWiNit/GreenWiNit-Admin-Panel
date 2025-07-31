import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const itemRef = React.useRef<HTMLButtonElement>(null)

  // aria-hidden 문제 해결을 위한 useEffect
  React.useEffect(() => {
    const element = itemRef.current
    if (element) {
      // aria-hidden 속성이 설정되면 제거
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
            const target = mutation.target as HTMLElement
            if (target.getAttribute('aria-hidden') === 'true') {
              target.removeAttribute('aria-hidden')
            }
          }
        })
      })

      observer.observe(element, {
        attributes: true,
        attributeFilter: ['aria-hidden'],
      })

      return () => observer.disconnect()
    }
  }, [])

  return (
    <RadioGroupPrimitive.Item
      ref={itemRef}
      data-slot="radio-group-item"
      className={cn(
        'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        // aria-hidden 문제 해결을 위한 추가 스타일
        'focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2',
        className,
      )}
      // 접근성 개선을 위한 추가 속성
      tabIndex={0}
      role="radio"
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }

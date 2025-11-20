import type { SubmitHandler } from 'react-hook-form'

export type FormState = {
  code: string
  name: string
  description: string
  thumbnailUrl: string | null
  price: number
  stock: number | null
}

export interface UpsertFormProps {
  defaultValues?: Partial<FormState> | undefined
  onSubmit: SubmitHandler<
    Omit<FormState, 'thumbnailUrl'> & { thumbnailUrl: NonNullable<FormState['thumbnailUrl']> }
  >
  renderBackButton?: boolean
  category?: '배송상품' | '아이템'
  categoryOnChange?: (category: '배송상품' | '아이템') => void
}

import type { SubmitHandler } from 'react-hook-form'

export interface FormState {
  code: string
  name: string
  description: string
  thumbnailUrl: string | null
  price: number
  stock: number
}

export interface UpsertFormProps {
  defaultValues?: Partial<FormState> | undefined
  onSubmit: SubmitHandler<
    Omit<FormState, 'thumbnailUrl'> & { thumbnailUrl: NonNullable<FormState['thumbnailUrl']> }
  >
  renderBackButton?: boolean
}

import type { DisplayStatus } from '@/api/challenge'
import type { SubmitHandler } from 'react-hook-form'

export interface FormState {
  title: string
  period: {
    start: Date | null
    end: Date | null
  }
  point: number
  /**
   * 참여방법
   */
  content: string
  imageUrl: string | null
  displayStatus: DisplayStatus
}

export interface UpsertFormProps {
  defaultValues?: Partial<FormState> | undefined
  onSubmit: SubmitHandler<FormState>
}

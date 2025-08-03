import type { DisplayStatus } from '@/api/challenge'
import type { SubmitHandler } from 'react-hook-form'

export interface FormState {
  title: string
  type: 'individual' | 'team'
  period: {
    start: Date | null
    end: Date | null
  }
  point: number
  /**
   * 참여방법
   */
  content: string
  // @TODO fix to string
  imageUrl: File | null
  displayStatus: DisplayStatus
}

export interface UpsertFormProps {
  defaultValues?: Partial<FormState> | undefined
  onSubmit: SubmitHandler<FormState>
}

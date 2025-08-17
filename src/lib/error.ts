import { toast } from 'sonner'

export class ApiErrorHasErrors extends Error {
  public readonly errors: FormValidateError[] = []
  constructor(
    message: string,
    formValidateErrors: Array<{
      fieldName: string
      message: string
    }>,
  ) {
    super(message)
    this.errors =
      formValidateErrors?.map((error) => ({
        fieldName: error?.fieldName,
        message: error?.message,
      })) ?? []
  }
}

interface FormValidateError {
  fieldName: string
  message: string
}

export function showMessageIfExists(error: Error) {
  if (error instanceof ApiErrorHasErrors) {
    error.errors.forEach((error) => {
      toast.error(error.message)
    })
  } else {
    toast.error(error.message)
  }
}

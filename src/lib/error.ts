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

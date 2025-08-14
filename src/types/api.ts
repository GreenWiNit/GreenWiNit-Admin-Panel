export type ApiResponse<T> = {
  message: string
} & (
  | {
      success: true
      result: T
    }
  | {
      success: false
      result: null
    }
)

export interface PaginatedData<T> {
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  content: T[]
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>

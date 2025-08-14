export type ApiResponse<R = never, S = never, F = never> =
  | {
      message: S extends string ? S : never
      success: true
      result: R extends infer T ? T : never
    }
  | {
      message: F extends string ? F : never
      success: false
      result: R extends never ? never : null
    }

export interface PaginatedData<E> {
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  content: E[]
}

export type PaginatedResponse<E = never, S = never, F = never> = ApiResponse<PaginatedData<E>, S, F>

export interface PaginatedData<T> {
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  content: T[]
}

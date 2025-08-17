export type ApiResponse<R = never, S = never, F = CommonFailureMessage> =
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

export type PaginatedResponse<E = never, S = never, F = CommonFailureMessage> = ApiResponse<
  PaginatedData<E>,
  S,
  F
>

export type CommonFailureMessage =
  | '접근이 거부되었습니다.'
  | '요청하신 페이지를 찾을 수 없습니다.'
  | '알 수 없는 서버 에러가 발생했습니다.'

export type CommonFailureMessageWithAuth =
  | CommonFailureMessage
  | 'JWT 토큰 유효성 검증에 실패했습니다.'

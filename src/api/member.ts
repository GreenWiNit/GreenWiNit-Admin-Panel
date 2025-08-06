import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from './../constant/network'

export const memberApi = {
  getActiveMembers: async (page = 0, pageSize = 10) => {
    const response = await fetch(`${API_URL}/admin/members?page=${page}&pageSize=${pageSize}`)
    return response.json() as Promise<GetActiveMembersReponse>
  },
  getWithdrawn: async (page = 0, pageSize = 10) => {
    const response = await fetch(
      `${API_URL}/admin/members/withdrawn?page=${page}&pageSize=${pageSize}`,
    )
    return response.json() as Promise<GetWithdrawnReponse>
  },
  getActiveMembersExcel: async () => {
    const response = await fetch(`${API_URL}/admin/members/excel`)
    return response.json() as Promise<GetActiveMembersExcelResponse>
  },
  getWithdrawnExcel: async () => {
    const response = await fetch(`${API_URL}/admin/members/withdrawn/excel`)
    return response.json() as Promise<GetWithdrawnExcelResponse>
  },
  deleteMemberByAdmin: async (memberKey: string) => {
    const response = await fetch(`${API_URL}/admin/members/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberKey }),
    })
    return response.json() as Promise<DeleteMemberByAdminResponse>
  },
}

type BaseResponse<T> = {
  success: string
  message: string
  result?: T
}

type BaseResult<T> = {
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: false
  content: T
}

export type MemberData = {
  memberKey: string // 'naver_123456789'
  email: string // 'user@naver.com'
  nickname: string // '홍길동'
  phoneNumber: string // '010-1234-5678'
  joinDate: string // '2025-01-15T10:30:00'
  role: string // '일반회원'
  provider: string // 'naver'
}

type WithdrawnData = MemberData & {
  withdrawalDate: '2025-01-20T14:20:00'
}

export type GetActiveMembersReponse = BaseResponse<BaseResult<MemberData[]>>

export type GetWithdrawnReponse = BaseResponse<BaseResult<WithdrawnData[]>>

type DeleteMemberByAdminResponse = BaseResponse<undefined>

type GetActiveMembersExcelResponse = Blob | BaseResponse<undefined> // excel 파일 반환은 JSON이 아닌 바이너리 타입(Blob)을 반환한다고

type GetWithdrawnExcelResponse = Blob | BaseResponse<undefined>

const memberKey = createQueryKeys('members', {
  active: (page?: number, pageSize?: number) =>
    ['active', { page: page ?? 0, pageSize: pageSize ?? 10 }] as const,
  withdrawn: (page?: number, pageSize?: number) =>
    ['withdrawn', { page: page ?? 0, pageSize: pageSize ?? 10 }] as const,
  deleteMember: (memberKey: string) => ['delete', { memberKey: memberKey }] as const,
  activeExcel: ['active', 'excel'],
  withdrawnExcel: ['withdrawn', 'excel'],
})

export const memberQueryKeys = mergeQueryKeys(memberKey)

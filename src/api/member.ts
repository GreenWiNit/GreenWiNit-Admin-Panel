import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from './../constant/network'
import { downloadExcel, throwResponseStatusThenChaining } from '@/lib/network'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { PointsListProps } from '@/types/list'
import type { MembersPoint } from '@/types/user'

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
    await downloadExcel(response)
  },
  getWithdrawnExcel: async () => {
    const response = await fetch(`${API_URL}/admin/members/withdrawn/excel`)
    await downloadExcel(response)
  },
  deleteMemberByAdmin: async (memberKey: string) => {
    const response = await fetch(`${API_URL}/admin/members/${memberKey}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.json() as Promise<ApiResponse>
  },
  getMembers: async ({ keyword, page, size }: PointsListProps) => {
    return await fetch(
      `${API_URL}/admin/members/points?keyword=${keyword}&page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(throwResponseStatusThenChaining)
      .then(async (res) => {
        return res.json() as Promise<PaginatedResponse<MembersPoint>>
      })
      .catch((error) => {
        throw new Error(error instanceof Error ? error.message : '예상치 못한 에러가 발생했습니다.')
      })
  },
}

export type Member = {
  memberKey: string // 'naver_123456789'
  email: string // 'user@naver.com'
  nickname: string // '홍길동'
  phoneNumber: string // '010-1234-5678'
  joinDate: string // '2025-01-15T10:30:00'
  role: string // '일반회원'
  provider: string // 'naver'
}

type WithdrawnData = Member & {
  withdrawalDate: '2025-01-20T14:20:00'
}

export type GetActiveMembersReponse = PaginatedResponse<Member>

export type GetWithdrawnReponse = PaginatedResponse<WithdrawnData>

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

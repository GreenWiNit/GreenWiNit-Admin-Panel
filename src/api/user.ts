import { API_URL } from '@/constant/network'
import { throwResponseStatusThenChaining } from '@/lib/network'
import type { PaginatedResponse } from '@/types/api'
import type { PointsListProps } from '@/types/list'
import type { UsersPoint } from '@/types/user'

export const usersApi = {
  getUsers: async ({ keyword, page, size }: PointsListProps) => {
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
        return res.json() as Promise<PaginatedResponse<UsersPoint>>
      })
      .catch((error) => {
        throw new Error(error instanceof Error ? error.message : '예상치 못한 에러가 발생했습니다.')
      })
  },
}

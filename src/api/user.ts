import { API_URL } from '@/constant/network'
import { throwResponseStatusThenChaining } from '@/lib/network'
import type { GetListProps } from '@/types/list'
import type { ActiveUser } from '@/types/user'

export const usersApi = {
  getUsers: async ({ page, size }: GetListProps) => {
    return await fetch(`${API_URL}/admin/members?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(throwResponseStatusThenChaining)
      .then(async (res) => {
        return res.json() as Promise<{
          success: true
          message: string
          result: {
            totalElements: number
            totalPages: number
            currentPage: number
            pageSize: number
            hasNext: true
            content: ActiveUser[]
          }
        }>
      })
      .catch((error) => {
        throw new Error(error instanceof Error ? error.message : '예상치 못한 에러가 발생했습니다.')
      })
  },
}

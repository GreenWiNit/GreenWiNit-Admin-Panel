import { API_URL } from '@/constant/network'
import type { ActiveUser } from '@/routes/points/type/user'

/* 포인트 전체 조회 할 때 유저 정보가 필요 */
export const usersApi = {
  getUsers: async (page: number, size: number) => {
    return await fetch(`${API_URL}/admin/members?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json()
        if (!data) {
          throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)
        }
        return data as {
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
        }
      })
      .catch((error) => {
        throw new Error(error instanceof Error ? error.message : '예상치 못한 에러가 발생했습니다.')
      })
  },
}

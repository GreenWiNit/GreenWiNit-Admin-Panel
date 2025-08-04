import { API_SERVER_BASE_PATH } from '@/constant/network'
import type { ActiveUser } from '@/routes/points/type/user'

/* 포인트 전체 조회 할 때 유저 정보가 필요 */
export const usersApi = {
  getUsers: async (page: number, size: number) => {
    return await fetch(`${API_SERVER_BASE_PATH}/admin/members?page=${page}&size=${size}}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(
        (res) =>
          res.json() as Promise<{
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
          }>,
      )
      .catch((error) => {
        throw new Error(error instanceof Error ? error.message : '예상치 못한 에러가 발생했습니다.')
      })
  },
}

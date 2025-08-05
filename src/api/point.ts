import { API_SERVER_BASE_PATH } from '@/constant/network'
import type { PointHistory } from '@/routes/points/type/point'

export const pointApi = {
  getUserPoints: async (id: number, page: number, size: number) => {
    await fetch(`${API_SERVER_BASE_PATH}/admin/points/members/${id}?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(
        (res) =>
          res.json() as Promise<{
            succes: true
            message: string
            result: {
              totalElements: number
              totalPages: number
              currentPage: number
              pageSize: number
              hasNext: true
              content: PointHistory[]
            }
          }>,
      )
      .catch((error) => {
        throw new Error(error instanceof Error ? error.message : '예상치 못한 에러가 발생했습니다.')
      })
  },
}

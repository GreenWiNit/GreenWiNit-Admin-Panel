import { API_URL } from '@/constant/network'
import type { PointHistory } from '@/routes/points/type/point'

export const pointApi = {
  getUsersPoint: async (id: number, page: number, size: number) => {
    return await fetch(`${API_URL}/admin/points/members/${id}?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} ${res.statusText}`)
        }
        const data = await res.json()
        return data as {
          success: true
          message: string
          result: {
            totalElements: number
            totalPages: number
            currentPage: number
            pageSize: number
            hasNext: boolean
            content: PointHistory[]
          }
        }
      })
      .catch((error) => {
        throw new Error(error instanceof Error ? error.message : '예상치 못한 에러가 발생했습니다.')
      })
  },
}

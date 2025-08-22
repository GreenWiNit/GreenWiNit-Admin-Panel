import { API_URL } from '@/constant/network'
import { downloadExcel, throwResponseStatusThenChaining } from '@/lib/network'
import { stringify } from '@/lib/query-string'
import type { PaginatedResponse } from '@/types/api'
import type { PointHistory } from '@/types/point'
import { createQueryKeys } from '@lukemorales/query-key-factory'

export const pointApi = {
  getMembersPoint: async ({ id, page, size }: { id: number; page: number; size: number }) => {
    return await fetch(`${API_URL}/admin/points/members/${id}?${stringify({ page, size })}`, {
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
        return data as PaginatedResponse<PointHistory>
      })
      .catch((error) => {
        throw new Error(error instanceof Error ? error.message : '예상치 못한 에러가 발생했습니다.')
      })
  },
  downloadExcel: async (memberId: number) => {
    return await fetch(`${API_URL}/admin/points/members/${memberId}/excel`)
      .then(throwResponseStatusThenChaining)
      .then((res) => downloadExcel(res))
  },
}

export const pointQueryKeys = createQueryKeys('points', {
  memberPoints: (params: { memberId: number; page: number; pageSize: number }) => [params] as const,
})

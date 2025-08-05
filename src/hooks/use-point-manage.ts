import { pointApi } from '@/api/point'
import { useQuery } from '@tanstack/react-query'

export const usePointManage = (memberId: number, page: number, size: number) => {
  useQuery({
    queryKey: ['users-point', memberId, page, size],
    queryFn: () => pointApi.getUserPoints(memberId, page, size),
  })
}

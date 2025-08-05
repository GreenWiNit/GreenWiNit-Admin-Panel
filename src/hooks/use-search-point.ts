import { pointApi } from '@/api/point'
import { useQuery } from '@tanstack/react-query'

export const useUserPoint = (id: number, page: number, size: number) =>
  useQuery({
    queryKey: ['user-point', id, page, size],
    queryFn: () => pointApi.getUsersPoint(id, page, size),
  })

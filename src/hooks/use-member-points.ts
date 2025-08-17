import { pointApi } from '@/api/point'
import { useQuery } from '@tanstack/react-query'

export const useMemberPoint = (id: number, page: number, size: number) =>
  useQuery({
    queryKey: ['user-points', id, page, size],
    queryFn: () => pointApi.getMembersPoint(id, page, size),
  })

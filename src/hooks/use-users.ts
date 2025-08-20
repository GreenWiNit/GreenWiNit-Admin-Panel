import { memberApi } from '@/api/member'
import type { PointsListProps } from '@/types/list'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useUsers = ({ keyword, page, size }: PointsListProps) => {
  return useQuery({
    queryKey: ['users', { keyword, page, size }],
    queryFn: () => memberApi.getMembers({ keyword, page, size }),
    retry: false,
    placeholderData: keepPreviousData,
  })
}

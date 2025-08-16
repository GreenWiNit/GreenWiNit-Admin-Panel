import { usersApi } from '@/api/user'
import type { PointsListProps } from '@/types/list'
import { useQuery } from '@tanstack/react-query'

export const useUsers = ({ keyword, page, size }: PointsListProps) => {
  return useQuery({
    queryKey: ['users', { keyword, page, size }],
    queryFn: () => usersApi.getUsers({ keyword, page, size }),
    retry: false,
  })
}

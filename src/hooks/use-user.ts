import { usersApi } from '@/api/user'
import { useQuery } from '@tanstack/react-query'

export const useSearchUserPoint = (page: number, size: number) => {
  return useQuery({
    queryKey: ['users', page, size], // page랑 size가 바뀌면 새로운 요청
    queryFn: () => usersApi.getUsers(size, page),
  })
}

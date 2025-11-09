import { postApi } from '@/api/post'
import { useQuery } from '@tanstack/react-query'

export const useGetPost = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postApi.getPost(id),
    enabled: !!id,
  })
}

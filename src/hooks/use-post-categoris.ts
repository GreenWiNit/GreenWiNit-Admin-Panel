import { useQuery } from '@tanstack/react-query'
import { postApi, postsQueryKeys } from '@/api/post'

const usePostCategories = () => {
  return useQuery({
    queryKey: postsQueryKeys.getCategories.queryKey,
    queryFn: postApi.getCategories,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export default usePostCategories

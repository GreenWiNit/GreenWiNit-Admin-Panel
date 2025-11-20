import { useMutation } from '@tanstack/react-query'
import { postsQueryKeys } from '@/api/post'
import { itemApi } from '@/api/item'
import { useNavigate } from '@tanstack/react-router'

export interface CreateItemParams {
  code: string
  name: string
  description: string
  thumbnailUrl: string
  price: number
}

const useCreateItem = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationKey: postsQueryKeys.getCategories.queryKey,
    mutationFn: ({ code, description, name, price, thumbnailUrl }: CreateItemParams) =>
      itemApi.createItem({ code, description, name, price, thumbnailUrl }),
    onSuccess: () => {
      navigate({ to: '/products' })
    },
  })
}

export default useCreateItem

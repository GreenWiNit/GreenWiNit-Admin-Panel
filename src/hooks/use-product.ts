import { productApi, productsQueryKeys } from '@/api/product'
import { useQuery } from '@tanstack/react-query'

function useProduct(id?: number | null) {
  return useQuery({
    queryKey: productsQueryKeys.getProduct(id).queryKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => productApi.getProduct(id!),
    enabled: !!id,
  })
}

export default useProduct

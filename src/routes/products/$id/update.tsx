import { productApi, productsQueryKeys } from '@/api/product'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import type { UpsertFormProps } from '@/components/products/type'
import UpsertForm from '@/components/products/upsert-form'
import { DEFAULT_PAGINATION_MODEL } from '@/constant/pagination'
import useProduct from '@/hooks/use-product'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/products/$id/update')({
  component: UpdateProduct,
})

function UpdateProduct() {
  const params = Route.useParams()
  const id = Number(params.id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: product } = useProduct(id)
  const formDefaultValues = useMemo(() => {
    if (!product) return product
    return {
      ...product.result,
      code: product.result?.code ?? '',
      name: product.result?.pointProductName ?? '',
      description: product.result?.description ?? '',
      thumbnailUrl: product.result?.thumbnailUrl ?? '',
      price: product.result?.pointPrice ?? 0,
      stock: product.result?.stockQuantity ?? 0,
    }
  }, [product])

  const { mutate: updateProduct } = useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.getProducts({
          page: DEFAULT_PAGINATION_MODEL.page,
          pageSize: DEFAULT_PAGINATION_MODEL.pageSize,
          status: null,
          keyword: '',
        }).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.getProduct(id).queryKey,
      })
      navigate({ to: '/products' })
    },
    onError: (error) => {
      console.error('onError', error)
      toast.error(error.message)
    },
  })

  const onSubmit: UpsertFormProps['onSubmit'] = (data) => {
    console.debug('onSubmit', data)
    updateProduct({
      id,
      ...data,
    })
  }

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex flex-col gap-4">
        <PageTitle>상품 수정 페이지</PageTitle>
        <UpsertForm onSubmit={onSubmit} defaultValues={formDefaultValues} />
      </div>
    </PageContainer>
  )
}

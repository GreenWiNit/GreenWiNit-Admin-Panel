import { productApi, productsQueryKeys } from '@/api/product'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import type { UpsertFormProps } from '@/components/products/type'
import UpsertForm from '@/components/products/upsert-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/products/$id/update')({
  component: UpdateProduct,
})

function UpdateProduct() {
  const params = Route.useParams()
  const id = Number(params.id)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: productsQueryKeys.getProduct(id).queryKey,
    queryFn: () => productApi.getProduct(id),
  })

  const { mutate: updateProduct } = useMutation({
    mutationFn: productApi.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.getProducts({
          page: 0,
          size: 10,
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
        <UpsertForm onSubmit={onSubmit} defaultValues={data?.result} />
      </div>
    </PageContainer>
  )
}

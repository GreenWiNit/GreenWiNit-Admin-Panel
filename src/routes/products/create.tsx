import { productApi, productsQueryKeys } from '@/api/product'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import type { UpsertFormProps } from '@/components/products/type'
import UpsertForm from '@/components/products/upsert-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/products/create')({
  component: CreateProduct,
})

function CreateProduct() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createProduct } = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.getProducts({
          page: 0,
          size: 10,
          status: null,
          keyword: '',
        }).queryKey,
      })
      navigate({ to: '/products' })
    },
    onError: (error) => {
      console.error('onError', error)
      toast.error(error.message)
    },
  })

  const onSubmit: UpsertFormProps['onSubmit'] = (data) => {
    createProduct(data)
  }

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex flex-col gap-4">
        <PageTitle>상품 등록</PageTitle>
        <UpsertForm onSubmit={onSubmit} renderBackButton />
      </div>
    </PageContainer>
  )
}

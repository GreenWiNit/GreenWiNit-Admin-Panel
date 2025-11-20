import { productApi, productsQueryKeys } from '@/api/product'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import type { UpsertFormProps } from '@/components/products/type'
import UpsertForm from '@/components/products/upsert-form'
import { DEFAULT_PAGINATION_MODEL } from '@/constant/pagination'
import useCreateItem from '@/hooks/item/use-create-item'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
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
          page: DEFAULT_PAGINATION_MODEL.page,
          pageSize: DEFAULT_PAGINATION_MODEL.pageSize,
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

  const { mutate: createItem } = useCreateItem()

  const onSubmit: UpsertFormProps['onSubmit'] = (data) => {
    return category === '배송상품'
      ? createProduct(data)
      : createItem({
          code: data.code,
          name: data.name,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl,
          price: Number(data.price),
        })
  }

  const [category, setCategory] = useState<'배송상품' | '아이템'>('배송상품')
  const categoryOnChange = (categoryStr: '배송상품' | '아이템') => {
    setCategory(categoryStr)
  }
  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex flex-col gap-4">
        <PageTitle>상품 등록</PageTitle>
        <UpsertForm
          categoryOnChange={categoryOnChange}
          category={category}
          onSubmit={onSubmit}
          renderBackButton
        />
      </div>
    </PageContainer>
  )
}

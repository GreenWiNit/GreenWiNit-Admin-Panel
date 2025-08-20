import { productApi, productsQueryKeys, type ProductsOrdersResponseElement } from '@/api/product'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Separator } from '@/components/shadcn/separator'
import useProduct from '@/hooks/use-product'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useId, useState } from 'react'

export const Route = createFileRoute('/products/$id/')({
  component: Product,
})

function Product() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const params = Route.useParams()
  const id = Number(params.id)
  const visibleElementId = useId()
  const notVisibleElementId = useId()

  const { data } = useProduct(id)
  const product = data?.result

  const { mutate: toggleDisplayStatus } = useMutation({
    mutationFn: (value: string) => productApi.toggleDisplayStatus(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.getProduct(id).queryKey,
      })
    },
  })
  const { mutate: deleteProduct } = useMutation({
    mutationFn: () => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKeys.getProduct(id).queryKey,
      })
      navigate({ to: '/products' })
    },
  })

  const [ordersPageModel, setOrdersPageModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const { data: ordersResponse } = useQuery({
    queryKey: productsQueryKeys.getProductsOrders({ id }).queryKey,
    queryFn: () => productApi.getProductsOrders({ id }),
  })

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle>상품 상세페이지</PageTitle>
        <Separator />
        <div className="flex justify-end gap-2">
          <Button asChild>
            <Link to={`/products/$id/update`} params={{ id: id.toString() }}>
              수정
            </Link>
          </Button>
          <Button onClick={() => deleteProduct()}>삭제</Button>
        </div>
        <table className="w-full border">
          <tbody className="[&_td,th]:border [&_td,th]:px-1 [&_td,th]:py-2 [&_th]:bg-gray-50 [&_th]:text-left">
            <tr>
              <th>상품코드</th>
              <td>{product?.code}</td>
              <th>포인트</th>
              <td>{product?.pointPrice}</td>
            </tr>
            <tr>
              <th>상품명</th>
              <td>{product?.pointProductName}</td>
              <th>수량</th>
              <td>{product?.stockQuantity}</td>
            </tr>
            <tr>
              <th>상품설명</th>
              <td colSpan={3}>{product?.description}</td>
            </tr>
            <tr>
              <th>상품이미지</th>
              <td colSpan={3}>
                <img src={product?.thumbnailUrl} alt="상품이미지" />
              </td>
            </tr>
            <tr>
              <th>판매상태</th>
              <td>{product?.sellingStatus}</td>
              <th>전시상태</th>
              <td>
                <RadioGroup
                  value={`${product?.display ?? null}`}
                  onValueChange={toggleDisplayStatus}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={visibleElementId} />
                    <Label htmlFor={visibleElementId}>전시</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={notVisibleElementId} />
                    <Label htmlFor={notVisibleElementId}>전시중지</Label>
                  </div>
                </RadioGroup>
              </td>
            </tr>
          </tbody>
        </table>
        <h4>교환 신청자 정보</h4>
        <DataGrid
          rows={ordersResponse?.result?.content ?? []}
          columns={columns}
          rowCount={ordersResponse?.result?.totalElements ?? 0}
          paginationModel={ordersPageModel}
          onPaginationModelChange={setOrdersPageModel}
        />
      </div>
    </PageContainer>
  )
}

const columns: GridColDef<ProductsOrdersResponseElement>[] = [
  { field: 'memberKey', headerName: 'MemberKey', flex: 1 },
  { field: 'memberEmail', headerName: '이메일', flex: 1 },
  { field: 'exchangedAt', headerName: '교환신청 날짜', flex: 1 },
  { field: 'deliveryStatus', headerName: '상품 처리 상태', flex: 1 },
]

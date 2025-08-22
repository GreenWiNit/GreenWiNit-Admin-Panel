import {
  productApi,
  productsQueryKeys,
  type DeliveryStatusKo,
  type OrdersResponseElement,
} from '@/api/product'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { createFileRoute } from '@tanstack/react-router'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useQueryDataGrid from '@/hooks/use-query-data-grid'
import { useState } from 'react'
import { toast } from 'sonner'
import { gridPaginationModelToApiParams } from '@/lib/api'

export const Route = createFileRoute('/products/orders/')({
  component: Orders,
})

interface SearchFormState {
  deliveryStatus: DeliveryStatusKo | null
  keyword: string
}

function Orders() {
  const searchFormBeforeSubmitting = useForm<SearchFormState>({
    defaultValues: DEFAULT_SEARCH_FORM,
  })

  const [searchFormToSubmit, setSearchFormToSubmit] = useState<SearchFormState>(DEFAULT_SEARCH_FORM)

  const { query, paginationModel, setPaginationModel, defaultDataGridProps } = useQueryDataGrid({
    queryKeyWithPageParams: (pageParams) =>
      productsQueryKeys.getOrders({
        ...searchFormToSubmit,
        ...pageParams,
        status: searchFormToSubmit.deliveryStatus ?? undefined,
      }),
    queryFn: (ctx) => {
      const [, , , { page, pageSize }] = ctx.queryKey
      return productApi.getOrders({
        ...gridPaginationModelToApiParams({ page, pageSize }),
        status: searchFormToSubmit.deliveryStatus ?? undefined,
        ...searchFormToSubmit,
      })
    },
  })
  const { data } = query

  const onSubmit: SubmitHandler<SearchFormState> = (data) => {
    setSearchFormToSubmit(data)
    setPaginationModel({ page: 0, pageSize: paginationModel.pageSize })
  }

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle>상품 교환 신청 내역</PageTitle>
        <Separator />
        <form
          onSubmit={searchFormBeforeSubmitting.handleSubmit(onSubmit)}
          className="flex flex-row gap-2"
        >
          <table className="w-full border">
            <tbody className="[&_td,th]:border [&_td,th]:px-1 [&_td,th]:py-2 [&_th]:bg-gray-50 [&_th]:text-left">
              <tr>
                <th>상품 처리 상태</th>
                <td>
                  <Controller
                    control={searchFormBeforeSubmitting.control}
                    name="deliveryStatus"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="전체" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="상품 신청">상품 신청</SelectItem>
                          <SelectItem value="배송중">배송중</SelectItem>
                          <SelectItem value="배송완료">배송완료</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </td>
              </tr>
              <tr>
                <th>검색어</th>
                <td>
                  <Input
                    placeholder="상품코드로 검색이 가능합니다."
                    {...searchFormBeforeSubmitting.register('keyword')}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Button type="submit" className="self-end">
            검색
          </Button>
        </form>
        <Button
          className="w-fit self-end"
          onClick={() => {
            productApi
              .downloadOrdersExcel({
                ...searchFormToSubmit,
                ...paginationModel,
              })
              .catch((error) => {
                console.error(error)
                toast.error(error.message)
              })
          }}
        >
          <FilePresentIcon />
          엑셀 받기
        </Button>
        <div>
          <DataGrid
            {...defaultDataGridProps}
            rows={data?.result?.content ?? []}
            rowCount={data?.result?.totalElements ?? 0}
            sx={{
              '& .MuiDataGrid-row': null,
            }}
            columns={columns}
            onPaginationModelChange={setPaginationModel}
            paginationModel={paginationModel}
          />
        </div>
      </div>
    </PageContainer>
  )
}

const DeliveryStatusCell = (params: GridRenderCellParams<OrdersResponseElement>) => {
  const queryClient = useQueryClient()
  const [deliveryStatus, setDeliveryStatus] = useState(params.value || '상품 신청')

  const isCompeltedDelivery = deliveryStatus === '배송 완료'

  const changeOrderStatus = useMutation({
    mutationFn: (status: '배송중' | '배송 완료') =>
      productApi.changeOrderStatus(params.row.id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.orders.queryKey })
      setDeliveryStatus(variables)
    },
    onError: () => {
      setDeliveryStatus(params.value || '상품 신청')
    },
  })

  return (
    <div className="mt-2 items-center">
      <Select
        value={deliveryStatus}
        onValueChange={(value) => {
          if (value === '상품 신청') return
          setDeliveryStatus(value)
          changeOrderStatus.mutate(value as '배송중' | '배송 완료')
        }}
        disabled={isCompeltedDelivery}
      >
        <SelectTrigger className={isCompeltedDelivery ? 'cursor-not-allowed opacity-50' : ''}>
          <SelectValue placeholder="상품 신청" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="상품 신청">상품 신청</SelectItem>
          <SelectItem value="배송중">배송중</SelectItem>
          <SelectItem value="배송 완료">배송완료</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

const columns: GridColDef<OrdersResponseElement>[] = [
  { field: 'exchangedAt', headerName: '신청날짜', flex: 1 },
  { field: 'memberKey', headerName: 'MemberKey', flex: 2 },
  { field: 'memberEmail', headerName: '사용자\n이메일', flex: 2 },
  { field: 'pointProductCode', headerName: '상품 코드', flex: 1 },
  { field: 'quantity', headerName: '수량', flex: 1 },
  { field: 'totalPrice', headerName: '차감\n포인트', flex: 1 },
  { field: 'recipientName', headerName: '이름', flex: 1 },
  { field: 'recipientPhoneNumber', headerName: '전화번호', flex: 1 },
  { field: 'fullAddress', headerName: '주소', flex: 3 },
  { field: 'status', headerName: '상품 처리 상태', flex: 1, renderCell: DeliveryStatusCell },
]

const DEFAULT_SEARCH_FORM: SearchFormState = {
  deliveryStatus: null,
  keyword: '',
}

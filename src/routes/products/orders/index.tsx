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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import usePaginationModelState from '@/hooks/use-pagination-model-state'
import { gridPaginationModelToApiParams } from '@/lib/api'

export const Route = createFileRoute('/products/orders/')({
  component: Orders,
})

interface SearchFormState {
  deliveryStatus: DeliveryStatusKo | null
  searchKeyword: string
}

function Orders() {
  const searchFormBeforeSubmitting = useForm<SearchFormState>({
    defaultValues: DEFAULT_SEARCH_FORM,
  })

  const [paginationModel, setPaginationModel] = usePaginationModelState()
  const [searchFormToSubmit, setSearchFormToSubmit] = useState<SearchFormState>(DEFAULT_SEARCH_FORM)

  const { data } = useQuery({
    queryKey: productsQueryKeys.getOrders({
      ...searchFormToSubmit,
      ...gridPaginationModelToApiParams(paginationModel),
      status: searchFormToSubmit.deliveryStatus ?? undefined,
    }).queryKey,
    queryFn: () =>
      productApi.getOrders({
        ...searchFormToSubmit,
        ...paginationModel,
        status: searchFormToSubmit.deliveryStatus ?? undefined,
      }),
  })

  const onSubmit: SubmitHandler<SearchFormState> = (data) => {
    setSearchFormToSubmit(data)
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
                  <Input {...searchFormBeforeSubmitting.register('searchKeyword')} />
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
        <DataGrid
          rows={data?.result?.content ?? []}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => {
            setPaginationModel(model)
          }}
        />
      </div>
    </PageContainer>
  )
}

const DeliveryStatusCell = (params: GridRenderCellParams<OrdersResponseElement>) => {
  const queryClient = useQueryClient()
  const changeOrderStatus = useMutation({
    mutationFn: (status: 'shipping' | 'complete') =>
      productApi.changeOrderStatus(params.row.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.orders.queryKey })
    },
  })

  return (
    <div>
      <Select
        value={params.value}
        onValueChange={(value) => {
          changeOrderStatus.mutate(value as 'shipping' | 'complete')
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="상품 신청" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="상품 신청">상품 신청</SelectItem> */}
          <SelectItem value="shipping">배송중</SelectItem>
          <SelectItem value="complete">배송완료</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

const columns: GridColDef<OrdersResponseElement>[] = [
  { field: 'exchangedAt', headerName: '신청날짜', flex: 1 },
  { field: 'memberKey', headerName: 'MemberKey', flex: 1 },
  { field: 'memberEmail', headerName: '사용자\n이메일', flex: 1 },
  { field: 'pointProductCode', headerName: '상품 코드', flex: 1 },
  { field: 'quantity', headerName: '수량', flex: 1 },
  { field: 'totalPrice', headerName: '차감\n포인트', flex: 1 },
  { field: 'recipientName', headerName: '이름', flex: 1 },
  { field: 'recipientPhoneNumber', headerName: '전화번호', flex: 1 },
  { field: 'fullAddress', headerName: '주소', flex: 1 },
  { field: 'status', headerName: '상품 처리 상태', flex: 1, renderCell: DeliveryStatusCell },
]

const DEFAULT_SEARCH_FORM: SearchFormState = {
  deliveryStatus: null,
  searchKeyword: '',
}

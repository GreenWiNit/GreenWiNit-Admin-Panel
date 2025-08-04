import {
  productApi,
  productsQueryKeys,
  type DeliveryStatus,
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

export const Route = createFileRoute('/products/orders/')({
  component: Orders,
})

interface SearchFormState {
  deliveryStatus: DeliveryStatus | null
  searchKeyword: string
}

function Orders() {
  const searchForm = useForm<SearchFormState>({
    defaultValues: {
      deliveryStatus: null,
      searchKeyword: '',
    },
  })

  const onSubmit: SubmitHandler<SearchFormState> = (data) => {
    console.log(data)
  }

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle>상품 교환 신청 내역</PageTitle>
        <Separator />
        <form onSubmit={searchForm.handleSubmit(onSubmit)} className="flex flex-row gap-2">
          <table className="w-full border">
            <tbody className="[&_td,th]:border [&_td,th]:px-1 [&_td,th]:py-2 [&_th]:bg-gray-50 [&_th]:text-left">
              <tr>
                <th>상품 처리 상태</th>
                <td>
                  <Controller
                    control={searchForm.control}
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
                  <Input {...searchForm.register('searchKeyword')} />
                </td>
              </tr>
            </tbody>
          </table>
          <Button type="submit" className="self-end">
            검색
          </Button>
        </form>
        <Button className="w-fit self-end">
          <FilePresentIcon />
          엑셀 받기
        </Button>
        <DataGrid
          rows={[]}
          columns={columns}
          rowCount={0}
          paginationModel={{ page: 0, pageSize: 10 }}
          onPaginationModelChange={(model) => {
            console.log(model)
          }}
        />
      </div>
    </PageContainer>
  )
}

const DeliveryStatusCell = (params: GridRenderCellParams<OrdersResponseElement>) => {
  const queryClient = useQueryClient()
  const changeOrderStatus = useMutation({
    mutationFn: (status: DeliveryStatus) => productApi.changeOrderStatus(params.row.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.orders.queryKey })
    },
  })

  return (
    <div>
      <Select
        value={params.value}
        onValueChange={(value) => {
          changeOrderStatus.mutate(value as DeliveryStatus)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="상품 신청" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="상품 신청">상품 신청</SelectItem>
          <SelectItem value="배송중">배송중</SelectItem>
          <SelectItem value="배송완료">배송완료</SelectItem>
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

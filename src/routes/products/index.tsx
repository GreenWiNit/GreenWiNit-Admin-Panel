import { productApi, productsQueryKeys, type ProductsResponseElement } from '@/api/product'
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
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/products/')({
  component: Products,
})

interface SearchForm {
  status: 'exchangeable' | 'sold-out' | null
  keyword: string
  page: number
  size: number
}

function Products() {
  const queryClient = useQueryClient()
  const searchForm = useForm<SearchForm>({
    defaultValues: {
      status: null,
      keyword: '',
      page: 0,
      size: 10,
    },
  })

  const { data } = useQuery({
    queryKey: productsQueryKeys.getProducts({
      page: searchForm.watch('page'),
      size: searchForm.watch('size'),
      status: searchForm.watch('status'),
      keyword: searchForm.watch('keyword'),
    }).queryKey,
    queryFn: (ctx) => {
      const [, , { page, size, status, keyword }] = ctx.queryKey
      return productApi.getProducts({ page, size, status, keyword })
    },
  })

  const onSubmit: SubmitHandler<SearchForm> = async (data) => {
    console.log(data)
    return queryClient.invalidateQueries({
      queryKey: productsQueryKeys.getProducts({
        page: data.page,
        size: data.size,
        status: data.status,
        keyword: data.keyword,
      }).queryKey,
    })
  }

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle>상품목록</PageTitle>
        <Separator />
        <form className="flex gap-2" onSubmit={searchForm.handleSubmit(onSubmit)}>
          <table className="w-full max-w-120">
            <tbody className="[&_td,th]:border [&_td,th]:px-1 [&_td,th]:py-2 [&_th]:bg-gray-50 [&_th]:text-center">
              <tr>
                <th>판매상태</th>
                <td>
                  <Controller
                    control={searchForm.control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        {...field}
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value ?? ''}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="전체" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exchangeable">교환가능</SelectItem>
                          <SelectItem value="sold-out">판매완료</SelectItem>
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
                    {...searchForm.register('keyword')}
                    placeholder="상품코드, 상품명으로 검색이 가능합니다."
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Button type="submit">검색</Button>
        </form>
        <div className="flex gap-2 self-end">
          <Button className="w-fit">
            <FilePresentIcon />
            엑셀 받기
          </Button>
          <Button asChild>
            <Link to="/products/create">등록</Link>
          </Button>
        </div>
        <DataGrid
          rows={
            data?.result.content?.map((item) => ({
              ...item,
              id: item.code,
            })) ?? []
          }
          columns={columns}
          paginationModel={{ page: searchForm.watch('page'), pageSize: searchForm.watch('size') }}
          pageSizeOptions={[10, 20, 50, 100]}
          onPaginationModelChange={(model) => {
            searchForm.setValue('page', model.page)
            searchForm.setValue('size', model.pageSize)
          }}
        />
      </div>
    </PageContainer>
  )
}

const columns: GridColDef<ProductsResponseElement>[] = [
  {
    field: 'code',
    headerName: '상품코드',
    flex: 1,
    renderCell(params) {
      return (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <Link to={`/products/$id`} params={{ id: params.row.id! }}>
          {params.row.id}
        </Link>
      )
    },
  },
  { field: 'name', headerName: '상품명', flex: 1 },
  { field: 'pointPrice', headerName: '교환 포인트', flex: 1 },
  { field: 'stockQuantity', headerName: '수량', flex: 1 },
  { field: 'sellingStatus', headerName: '판매상태', flex: 1 },
  { field: 'displayStatus', headerName: '전시상태', flex: 1 },
  { field: 'createdDate', headerName: '등록일', flex: 1 },
]

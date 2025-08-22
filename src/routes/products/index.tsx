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
import { createFileRoute } from '@tanstack/react-router'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { Link } from '@tanstack/react-router'
import useQueryDataGrid from '@/hooks/use-query-data-grid'
import { gridPaginationModelToApiParams } from '@/lib/api'

export const Route = createFileRoute('/products/')({
  component: Products,
})

interface SearchForm {
  status: 'exchangeable' | 'sold-out' | null
  keyword: string
}

function Products() {
  const searchFormBeforeSubmitting = useForm<SearchForm>({
    defaultValues: DEFAULT_SEARCH_FORM,
  })

  const [searchFormToSubmit, setSearchFormToSubmit] = useState<SearchForm>(DEFAULT_SEARCH_FORM)

  const { query, paginationModel, setPaginationModel, defaultDataGridProps } = useQueryDataGrid({
    queryKeyWithPageParams: (pageParams) =>
      productsQueryKeys.getProducts({
        ...pageParams,
        status: searchFormToSubmit.status,
        keyword: searchFormToSubmit.keyword,
      }),
    queryFn: (ctx) => {
      const [, , { page, pageSize, status, keyword }] = ctx.queryKey
      return productApi.getProducts({
        ...gridPaginationModelToApiParams({ page, pageSize }),
        status,
        keyword,
      })
    },
  })
  const { data } = query

  const onSubmit: SubmitHandler<SearchForm> = async (data) => {
    setSearchFormToSubmit(data)
  }

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle>상품목록</PageTitle>
        <Separator />
        <form className="flex gap-2" onSubmit={searchFormBeforeSubmitting.handleSubmit(onSubmit)}>
          <table className="w-full max-w-120">
            <tbody className="[&_td,th]:border [&_td,th]:px-1 [&_td,th]:py-2 [&_th]:bg-gray-50 [&_th]:text-center">
              <tr>
                <th>판매상태</th>
                <td>
                  <Controller
                    control={searchFormBeforeSubmitting.control}
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
                    {...searchFormBeforeSubmitting.register('keyword')}
                    placeholder="상품코드, 상품명으로 검색이 가능합니다."
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <Button type="submit">검색</Button>
        </form>
        <div className="flex gap-2 self-end">
          <Button
            className="w-fit"
            onClick={() => {
              productApi.downloadProductsExcel({
                keyword: searchFormBeforeSubmitting.watch('keyword'),
                status: searchFormBeforeSubmitting.watch('status'),
              })
            }}
          >
            <FilePresentIcon />
            엑셀 받기
          </Button>
          <Button asChild>
            <Link to="/products/create">등록</Link>
          </Button>
        </div>
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
        <Link to={`/products/$id`} params={{ id: params.row.id }}>
          {params.row.code}
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

const DEFAULT_SEARCH_FORM: SearchForm = {
  status: null,
  keyword: '',
}

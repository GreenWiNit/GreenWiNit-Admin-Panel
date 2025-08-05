import { postApi, postsQueryKeys, type PostsElement } from '@/api/post'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import { DataGrid, type GridColDef, type GridRowSelectionModel } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import FilePresentIcon from '@mui/icons-material/FilePresent'

export const Route = createFileRoute('/posts/')({
  component: Posts,
})

function Posts() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const { data } = useQuery({
    queryKey: postsQueryKeys.getPosts(page, size).queryKey,
    queryFn: () => postApi.getPosts(page, size),
  })
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel | null>(null)
  const queryClient = useQueryClient()

  const { mutate: deletePost } = useMutation({
    mutationFn: (id: string) => postApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.getPosts(page, size).queryKey })
    },
  })
  const handleDelete = () => {
    console.log('handleDelete', selectedRows)
    if (!selectedRows) {
      return
    }
    for (const id of selectedRows.ids) {
      deletePost(id.toString())
    }
  }

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle>정보공유관리</PageTitle>
        <Separator />
        <div className="flex w-full flex-col gap-4">
          <div className="flex justify-between self-end">
            <div className="flex gap-2">
              <Button
                className="w-fit"
                onClick={() => {
                  postApi.downloadExcel()
                }}
              >
                <FilePresentIcon />
                엑셀 받기
              </Button>
              <Button className="w-fit" asChild>
                <Link to="/posts/upsert" search={{ id: undefined }}>
                  생성
                </Link>
              </Button>
              <Button className="w-fit" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          </div>
          <DataGrid
            checkboxSelection
            columns={columns}
            rows={
              data?.result.content?.map(
                (post) =>
                  ({
                    ...post,
                    isDisplayKo: post.isDisplay === 'Y' ? '전시' : '미전시',
                  }) as const,
              ) ?? []
            }
            paginationModel={{ page, pageSize: size }}
            onPaginationModelChange={(model) => {
              setPage(model.page)
              setSize(model.pageSize)
            }}
            onRowSelectionModelChange={(model) => {
              setSelectedRows(model)
            }}
          />
        </div>
      </div>
    </PageContainer>
  )
}

const columns: GridColDef<PostsElement & { isDisplayKo: '전시' | '미전시' }>[] = [
  { field: 'infoCategoryName', headerName: '카테고리' },
  {
    field: 'id',
    headerName: '정보공유코드',
    renderCell: (params) => (
      <Link to="/posts/upsert" search={{ id: params.row.id }}>
        {params.row.id}
      </Link>
    ),
  },
  {
    field: 'title',
    headerName: '정보공유명',
    renderCell: (params) => (
      <Link to="/posts/upsert" search={{ id: params.row.id }}>
        {params.row.title}
      </Link>
    ),
  },
  { field: 'createdBy', headerName: '작성자' },
  { field: 'isDisplayKo', headerName: '전시' },
]

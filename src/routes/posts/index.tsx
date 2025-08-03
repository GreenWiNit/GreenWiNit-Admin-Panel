import { postApi, postsQueryKeys, type PostsElement } from '@/api/post'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import { DataGrid, type GridColDef, type GridRowSelectionModel } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
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

  const handleDelete = () => {
    if (!selectedRows) return
    console.log(selectedRows)
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
              <Button className="w-fit">
                <FilePresentIcon />
                엑셀 받기
              </Button>
              <Button className="w-fit" asChild>
                <Link to="/posts/upsert">생성</Link>
              </Button>
              <Button className="w-fit" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          </div>
          <DataGrid
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
            rowSelection
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
  { field: 'id', headerName: '정보공유코드' },
  { field: 'title', headerName: '제목' },
  { field: 'createdBy', headerName: '작성자' },
  { field: 'isDisplayKo', headerName: '전시' },
]

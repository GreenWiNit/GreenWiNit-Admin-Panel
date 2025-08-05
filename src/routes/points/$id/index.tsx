// routes/points/$memberKey.tsx
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { useUserPoint } from '@/hooks/use-search-point'
import { Separator } from '@/components/shadcn/separator'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { PointHistory } from '@/types/point'
import { useUsers } from '@/hooks/use-user'
import type { ActiveUser } from '@/types/user'

export const Route = createFileRoute('/points/$id/')({
  component: PointDetail,
})

const userColumns: GridColDef<ActiveUser>[] = [
  { field: 'memberKey', headerName: 'MemberKey', width: 150 },
  { field: 'email', headerName: '사용자 이메일', width: 200 },
  { field: 'nickname', headerName: '닉네임', width: 200 },
]

const pointHistoryColumns: GridColDef<PointHistory>[] = [
  { field: 'transcationAt', headerName: '날짜', width: 100 },
  { field: 'type', headerName: '구분', width: 150 },
  { field: 'description', headerName: '내용', width: 100 },
  { field: 'transcationAt', headerName: '적립 포인트', width: 150 },
  { field: 'transcationAt', headerName: '차감 포인트', width: 150 },
  { field: 'transcationAt', headerName: '남은 포인트', width: 150 },
]

function PointDetail() {
  const { id } = Route.useParams()

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const { data: usersInfoData, isLoading: infoLoading } = useUsers(page, size)
  const { data: usersPointData, isLoading: pointLoading } = useUserPoint(id, page, size)

  if (infoLoading || pointLoading || usersInfoData === undefined || usersPointData === undefined)
    return <div>로딩 중...</div>

  const userRow = usersInfoData.result.content.filter((c) => c.memberKey === id)
  const usersPointRow = usersPointData.result.content

  if (!userRow) {
    return (
      <div>
        <PageContainer className="flex h-screen w-screen flex-row">
          <GlobalNavigation />
          <div className="mx-2 flex w-full flex-col">
            <PageTitle className="mb-2 flex flex-row">사용자 포인트 내역</PageTitle>
            <Separator />
            <div className="mt-2">사용자를 찾을 수 없습니다.</div>
          </div>
        </PageContainer>
      </div>
    )
  }

  return (
    <div>
      <PageContainer className="flex h-screen w-screen flex-row">
        <GlobalNavigation />
        <div className="mx-2 flex w-full flex-col">
          <PageTitle className="mb-2 flex flex-row">사용자 포인트 내역</PageTitle>
          <Separator />
          <div className="mt-2">
            <DataGrid
              rows={userRow}
              columns={userColumns}
              paginationModel={{ page, pageSize: size }}
              onPaginationModelChange={(model) => {
                setPage(model.page)
                setSize(model.pageSize)
              }}
            />
          </div>
          <div className="mt-4">
            <DataGrid
              rows={usersPointRow}
              columns={pointHistoryColumns}
              paginationModel={{ page, pageSize: size }}
              onPaginationModelChange={(model) => {
                setPage(model.page)
                setSize(model.pageSize)
              }}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

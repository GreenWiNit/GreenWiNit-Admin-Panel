// routes/points/$memberKey.tsx
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { useUserPoint } from '@/hooks/use-search-point'
import { Separator } from '@/components/shadcn/separator'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { PointHistory } from '@/types/point'
import { useUsers } from '@/hooks/use-users'
import type { ActiveUser } from '@/types/user'

function PointDetail() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const { id } = useParams({ from: '/points/$id/' })
  const memberId = parseInt(id)

  const { data: usersInfoData, isLoading: infoLoading } = useUsers(page, size)
  const { data: usersPointData, isLoading: pointLoading } = useUserPoint(memberId, page, size)

  if (infoLoading || usersInfoData === undefined)
    return <div className="flex justify-center">유저 정보 로딩 중...</div>

  if (pointLoading || usersPointData === undefined)
    return <div className="flex justify-center">포인트 정보 조회 중...</div>

  const userRow = usersInfoData.result.content.filter((c) => c.memberId === memberId)
  const usersPointRow = usersPointData.result.content.map((point) => ({
    ...point,
    id: point.pointTrasactionId,
  }))

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
          <div className="mt-2 w-160">
            <DataGrid
              rows={userRow}
              columns={userColumns}
              getRowId={(row) => row.memberId}
              paginationModel={{ page, pageSize: size }}
              onPaginationModelChange={(model) => {
                setPage(model.page)
                setSize(model.pageSize)
              }}
              hideFooter={true}
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
              checkboxSelection={true}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}

export const Route = createFileRoute('/points/$id/')({
  component: PointDetail,
})

const userColumns: GridColDef<ActiveUser>[] = [
  { field: 'memberKey', headerName: 'MemberKey', flex: 3 },
  { field: 'email', headerName: '사용자 이메일', flex: 2 },
  { field: 'nickname', headerName: '닉네임', flex: 1 },
]

const pointHistoryColumns: GridColDef<PointHistory>[] = [
  { field: 'transcationAt', headerName: '날짜', flex: 2 },
  { field: 'type', headerName: '구분', flex: 1 },
  { field: 'description', headerName: '내용', flex: 2 },
  { field: 'earnedAmount', headerName: '적립 포인트', flex: 1 },
  { field: 'spendAmount', headerName: '차감 포인트', flex: 1 },
  { field: 'balanceAfter', headerName: '남은 포인트', flex: 1 },
]

import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Separator } from '@/components/shadcn/separator'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { PointHistory } from '@/types/point'
import { Button } from '@/components/shadcn/button'
import { FileSpreadsheetIcon } from 'lucide-react'
import { pointApi } from '@/api/point'
import { memberStore, type MemberList } from '@/store/memberStore'
import { useMemberPoint } from '@/hooks/use-member-points'

function PointDetail() {
  const { id } = useParams({ from: '/points/$id/' })
  const memberId = parseInt(id)
  const member = memberStore((state) => state.selectedMember)
  const { query, paginationModel, setPaginationModel, defaultDataGridProps } =
    useMemberPoint(memberId)
  const usersPointData = query.data

  const userRow = member
    ? [
        {
          ...member,
          id: memberId,
        },
      ]
    : []

  const usersPointRow =
    usersPointData?.result?.content.map((point) => ({
      ...point,
      id: point.pointTransactionId,
    })) ?? []

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
          <div className="mt-2 w-200">
            <DataGrid rows={userRow} columns={userColumns} hideFooter={true} />
          </div>
          <div className="flex-start mt-4 flex justify-end">
            <Button
              className="w-fit"
              onClick={() => {
                pointApi.downloadExcel(memberId)
              }}
            >
              <FileSpreadsheetIcon />
              엑셀 받기
            </Button>
          </div>
          <div className="mt-4">
            <DataGrid
              {...defaultDataGridProps}
              rows={usersPointRow ?? []}
              getRowId={(row) => row.pointTransactionId}
              rowCount={usersPointData?.result?.totalElements ?? 0}
              columns={pointHistoryColumns}
              checkboxSelection={false}
              sx={{
                '& .MuiDataGrid-row': null,
              }}
              onPaginationModelChange={setPaginationModel}
              paginationModel={paginationModel}
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

const userColumns: GridColDef<MemberList>[] = [
  { field: 'memberKey', headerName: 'MemberKey', flex: 3 },
  { field: 'memberEmail', headerName: '사용자 이메일', flex: 2 },
  { field: 'memberNickname', headerName: '닉네임', flex: 1 },
]

const pointHistoryColumns: GridColDef<PointHistory>[] = [
  { field: 'transactionAt', headerName: '날짜', flex: 1, headerAlign: 'center' },
  { field: 'type', headerName: '구분', flex: 2, headerAlign: 'center' },
  { field: 'description', headerName: '내용', flex: 2, headerAlign: 'center' },
  { field: 'earnedAmount', headerName: '적립 포인트', flex: 1, headerAlign: 'center' },
  { field: 'spentAmount', headerName: '차감 포인트', flex: 1, headerAlign: 'center' },
  { field: 'balanceAfter', headerName: '남은 포인트', flex: 1, headerAlign: 'center' },
]

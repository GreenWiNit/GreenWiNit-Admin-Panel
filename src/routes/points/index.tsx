import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import Input from '@mui/material/Input'
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid'
import { Separator } from '@radix-ui/react-separator'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useUsers } from '@/hooks/use-users'
import GlobalNavigation from '@/components/global-navigation'
import { memberStore } from '@/store/memberStore'
import type { MembersPoint } from '@/types/user'
import type { PointManageMemberList } from '@/types/point'

function PointsPage() {
  const router = useRouter()
  const setSelectedMember = memberStore((state) => state.setSelectedMember)
  const [searchInput, setSearchInput] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')

  const { query, paginationModel, setPaginationModel, defaultDataGridProps } = useUsers({
    keyword,
  })
  const userManageData = query.data

  const handleRowClick = (params: GridRowParams<MembersPoint>) => {
    const memberData = params.row
    setSelectedMember(memberData)
    router.navigate({ to: `/points/${memberData.memberId}` })
  }

  const handleSearch = () => {
    paginationModel.page = 0
    setKeyword(searchInput)
  }

  const rows =
    userManageData?.result?.content.map(
      (user: MembersPoint): MembersPoint => ({
        memberId: user.memberId,
        memberKey: user.memberKey,
        memberEmail: user.memberEmail,
        memberNickname: user.memberNickname,
        memberPoint: user.memberPoint,
      }),
    ) ?? []

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="mx-8 flex w-full flex-col gap-2">
        <PageTitle>포인트 관리</PageTitle>
        <Separator />
        <div className="flex flex-row items-center gap-2 border-2 py-2">
          <div className="shrink-0 border-r-2 px-2 py-0 font-bold">검색어</div>
          <Input
            placeholder="사용자 ID 또는 닉네임 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex flex-1 border-0 focus:outline-0"
          />
          <button onClick={handleSearch} className="f-full rounded-0 border-black px-8 py-1">
            검색
          </button>
        </div>
        <div className="scrollbar-hide mt-2 h-160 w-full">
          <DataGrid
            {...defaultDataGridProps}
            rows={rows}
            getRowId={(row) => row.memberKey}
            onRowClick={handleRowClick}
            rowCount={userManageData?.result?.totalElements ?? 0}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export const Route = createFileRoute('/points/')({
  component: PointsPage,
})

const columns: GridColDef<PointManageMemberList>[] = [
  { field: 'memberKey', headerName: 'MemberKey', flex: 1 },
  { field: 'memberEmail', headerName: '사용자 이메일', flex: 2 },
  { field: 'memberNickname', headerName: '닉네임', flex: 2 },
  { field: 'memberPoint', headerName: '남은 포인트', flex: 2 },
]

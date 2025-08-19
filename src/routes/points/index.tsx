import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import Input from '@mui/material/Input'
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowParams,
} from '@mui/x-data-grid'
import { Separator } from '@radix-ui/react-separator'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useUsers } from '@/hooks/use-users'
import GlobalNavigation from '@/components/global-navigation'
import { memberStore } from '@/store/memberStore'
import type { MembersPoint } from '@/types/user'
import type { PointManageMemberList } from '@/types/point'
import { DEFAULT_PAGINATION_MODEL } from '@/constant/pagination'

function PointsPage() {
  const router = useRouter()
  const setSelectedMember = memberStore((state) => state.setSelectedMember)

  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>(DEFAULT_PAGINATION_MODEL)
  const [searchInput, setSearchInput] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const { data: userManageData } = useUsers({
    keyword: keyword,
    page: paginationModel.page + 1,
    size: paginationModel.pageSize,
  })

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
            rows={rows}
            columns={columns}
            getRowId={(row) => row.memberKey}
            onRowClick={handleRowClick}
            initialState={{
              pagination: {
                paginationModel: DEFAULT_PAGINATION_MODEL,
              },
            }}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            rowCount={userManageData?.result?.totalElements ?? 0}
            paginationMode="server"
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

import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import Input from '@mui/material/Input'
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid'
import { Separator } from '@radix-ui/react-separator'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useUsers } from '@/hooks/use-users'
import type { PointManageUserList } from '@/types/point'
import type { UsersPoint } from '@/types/user'
import GlobalNavigation from '@/components/global-navigation'
import { memberStore } from '@/store/memberStore'

function PointsPage() {
  const router = useRouter()
  const setSelectedMember = memberStore((state) => state.setSelectedMember)

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [searchInput, setSearchInput] = useState<string>('')
  const [keyword, setKeyword] = useState<string>('')
  const { data: userManageData } = useUsers({ keyword: keyword, page, size })

  const handleRowClick = (params: GridRowParams<UsersPoint>) => {
    const memberData = params.row
    setSelectedMember(memberData)
    router.navigate({ to: `/points/${memberData.memberId}` })
  }

  const handleSearch = () => {
    setKeyword(searchInput)
    setPage(1)
  }

  const rows =
    userManageData?.result.content.map(
      (user: UsersPoint): UsersPoint => ({
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
            paginationModel={{ page, pageSize: size }}
            onRowClick={handleRowClick}
            onPaginationModelChange={(model) => {
              setPage(model.page)
              setSize(model.pageSize)
            }}
            checkboxSelection={true}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export const Route = createFileRoute('/points/')({
  component: PointsPage,
})

const columns: GridColDef<PointManageUserList>[] = [
  { field: 'memberKey', headerName: 'MemberKey', width: 150 },
  { field: 'memberEmail', headerName: '사용자 이메일', width: 200 },
  { field: 'memberNickname', headerName: '닉네임', width: 200 },
  { field: 'memberPoint', headerName: '남은 포인트', width: 200 },
]

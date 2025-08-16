import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import Input from '@mui/material/Input'
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid'
import { Separator } from '@radix-ui/react-separator'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useUsers } from '@/hooks/use-users'
import type { PointManageUserList } from '@/types/point'
import type { ActiveUser } from '@/types/user'
import GlobalNavigation from '@/components/global-navigation'

function PointsPage() {
  const router = useRouter()

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [searchUser, setSearchUser] = useState<string>('')
  const { data: userManageData, isLoading: usersLoading } = useUsers(page, size)

  if (usersLoading || userManageData === undefined)
    return <div className="flex justify-center">유저 정보 불러오는 중...</div>

  const handleRowClick = (params: GridRowParams<PointManageUserList>) => {
    const memberId = params.row.memberId

    router.navigate({ to: `/points/${memberId}` }) // id가 없이 멤버키로 사용자를 조회해야 되는가?
  }

  const handleSearch = () => {
    /**
     * @TODO 검색 기능 추가
     * ref: https://github.com/GreenWiNit/backend/issues/225
     */
  }

  const rows =
    userManageData.result.content.map(
      (user: ActiveUser): PointManageUserList => ({
        memberId: user.memberId,
        memberKey: user.memberKey,
        email: user.email,
        nickname: user.nickname,
        /**
         *
         * @TODO balanceAfter 다른 곳에서 불러와야 함 - 남은 포인트가 이것이 맞는가?
         */
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
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
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
  { field: 'memberKey', headerName: 'MemberKey', flex: 1 },
  { field: 'email', headerName: '사용자 이메일', flex: 1 },
  { field: 'nickname', headerName: '닉네임', flex: 1 },
  { field: 'balanceAfter', headerName: '남은 포인트', flex: 1 },
]

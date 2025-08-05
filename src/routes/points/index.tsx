import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import Input from '@mui/material/Input'
import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
  type GridRowSelectionModel,
} from '@mui/x-data-grid'
import { Separator } from '@radix-ui/react-separator'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useSearchUser } from '@/hooks/use-user'
import type { PointManageUserList } from './type/point'
import type { ActiveUser } from './type/user'

export const Route = createFileRoute('/points/')({
  component: Points,
})

const columns: GridColDef<PointManageUserList>[] = [
  { field: 'memberKey', headerName: 'MemberKey', width: 150 },
  { field: 'email', headerName: '사용자 이메일', width: 200 },
  { field: 'nickname', headerName: '닉네임', width: 200 },
  { field: 'balanceAfter', headerName: '남은 포인트', width: 200 },
]

function Points() {
  const router = useRouter()

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [searchUser, setSearchUser] = useState<string>('')
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel | null>(null)
  const { data: userManageData } = useSearchUser(page, size)
  console.log(selectedRows) // 나중에 사용해야 함

  const handleRowClick = (params: GridRowParams<PointManageUserList>) => {
    const memberKey = params.row.memberKey

    router.navigate({ to: `/points/${memberKey}` })
  }

  const handleSearch = () => {
    /* 검색 기능 추가 */
  }

  const rows =
    userManageData?.result.content.map(
      (user: ActiveUser): PointManageUserList => ({
        memberKey: user.memberKey,
        email: user.email,
        nickname: user.nickname,
        /* balanceAfter: 다른 곳에서 불러와야 함 */
      }),
    ) ?? []

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="mx-8 flex w-full flex-col gap-2">
        <PageTitle>포인트 관리</PageTitle>
        <Separator />
        <div className="flex flex-row items-center gap-4 border-2">
          <div className="shrink-0 border-r-2 px-2 py-0 font-bold">검색어</div>
          <Input
            placeholder="사용자 ID 또는 닉네임 검색"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="flex flex-1 border-2 focus:border-b-black"
          />
          <button onClick={handleSearch} className="f-full rounded-0 border-2 border-black px-8">
            검색
          </button>
        </div>
        <div className="mt-2 h-80 w-full">
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
            onRowSelectionModelChange={(row) => {
              setSelectedRows(row)
            }}
          />
        </div>
      </div>
    </PageContainer>
  )
}

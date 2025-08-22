import dayjs from 'dayjs'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { createFileRoute } from '@tanstack/react-router'
import { memberApi, type Member } from '@/api/member'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { Button } from '@/components/shadcn/button'
import { useWithDrawn } from '@/hooks/use-members'
import { Separator } from '@radix-ui/react-select'

export const Route = createFileRoute('/members/withdrawn/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { query, paginationModel, setPaginationModel, defaultDataGridProps } = useWithDrawn()
  const data = query.data

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle className="self-start">탈퇴회원목록</PageTitle>
        <Separator />
        <div className="flex justify-between">
          <span className="text-2xl">Title : {data?.result?.totalElements}</span>
          <Button className="w-fit" onClick={memberApi.getWithdrawnExcel}>
            <FilePresentIcon />
            엑셀 받기
          </Button>
        </div>
        <div className="flex w-full">
          <DataGrid
            {...defaultDataGridProps}
            rows={
              data?.result?.content.map((item) => ({
                ...item,
                id: item.memberKey,
                joinDate: dayjs(item.joinDate).format('YYYY-MM-DD'),
                withdrawalDate: dayjs(item.withdrawalDate).format('YYYY-MM-DD'),
              })) ?? []
            }
            rowCount={data?.result?.totalElements ?? 0}
            columns={columns}
            onPaginationModelChange={setPaginationModel}
            paginationModel={paginationModel}
          />
        </div>
      </div>
    </PageContainer>
  )
}

const columns: GridColDef<Member>[] = [
  { field: 'memberKey', headerName: 'MemberKey', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'email', headerName: '이메일', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'nickname', headerName: '닉네임', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'phoneNumber', headerName: '전화번호', flex: 1, headerAlign: 'center', align: 'center' },
  {
    field: 'joinDate',
    headerName: '가입일',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
  },

  {
    field: 'withdrawalDate',
    headerName: '탈퇴일',
    flex: 1,
    headerAlign: 'center',
    align: 'center',
  },
  { field: 'role', headerName: '등급', flex: 1, headerAlign: 'center', align: 'center' },
]

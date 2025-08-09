import GlobalNavigation from '@/components/global-navigation'
import dayjs from 'dayjs'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { Separator } from '@radix-ui/react-select'
import { createFileRoute } from '@tanstack/react-router'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { memberApi, type Member } from '@/api/member'
import { Button } from '@/components/shadcn/button'
import { useActiveMembers } from '@/hooks/use-members'
import { toast } from 'sonner'
import { postApi } from '@/api/post'
import AllertDialog from '@/components/dialog/AllertDialog'

export const Route = createFileRoute('/members/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useActiveMembers()
  if (!data) return <div>데이터를 불러오는 중...</div> //@TODO fallback ui로 대체될 예정 (기획 미정)
  if (!data.result?.content) return <div>리스트가 없습니다..</div>

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle className="self-start">회원 목록</PageTitle>
        <Separator />
        <div className="flex justify-between">
          <span className="text-2xl">Title : {data.result?.totalElements}</span>
          <Button className="w-fit" onClick={() => postApi.downloadExcel()}>
            <FilePresentIcon />
            엑셀 받기
          </Button>
        </div>
        <div className="flex w-full">
          <DataGrid
            rows={data.result?.content.map((item) => ({
              ...item,
              id: item.memberKey,
              joinDate: dayjs(item.joinDate).format('YYYY-MM-DD'),
            }))}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
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
  { field: 'joinDate', headerName: '가입일', flex: 1, headerAlign: 'center', align: 'center' },
  { field: 'role', headerName: '등급', flex: 1, headerAlign: 'center', align: 'center' },
  {
    field: 'actions',
    headerName: '관리',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    sortable: false,
    renderCell: (params) => {
      const memberKey = params.row.memberKey
      return (
        <div className="flex h-full w-full items-center justify-center">
          <AllertDialog
            trigger={
              <button
                className="flex h-[28px] w-[60px] cursor-pointer items-center justify-center rounded border border-gray-300 text-[12px]"
                onClick={(e) => e.stopPropagation()}
              >
                삭제
              </button>
            }
            onClick={async () => {
              const res = await memberApi.deleteMemberByAdmin(memberKey)
              if (res.success) toast.success('회원 삭제에 성공했습니다.')
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            }}
          />
        </div>
      )
    },
  },
]

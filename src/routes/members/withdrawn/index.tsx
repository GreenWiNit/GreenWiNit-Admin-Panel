import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { Button } from '@/components/shadcn/button'
import { useWithDrawn } from '@/hooks/use-members'
import { Separator } from '@radix-ui/react-select'
import { createFileRoute } from '@tanstack/react-router'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { MemberData } from '@/api/member'
import dayjs from 'dayjs'

export const Route = createFileRoute('/members/withdrawn/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useWithDrawn()
  if (!data) return <div>데이터를 불러오는 중...</div> //@TODO fallback ui로 대체될 예정 (기획 미정)
  if (!data.result?.content) return <div>리스트가 없습니다..</div>

  const downloadExcel = () => {
    // @TODO 엑셀 다운로드 api 연결 예정
  }

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle className="self-start">탈퇴회원목록</PageTitle>
        <Separator />
        <div className="flex justify-between">
          <span className="text-2xl">Title : {data.result?.totalElements}</span>
          <Button className="w-fit" onClick={downloadExcel}>
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
              withdrawalDate: dayjs(item.withdrawalDate).format('YYYY-MM-DD'),
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

const columns: GridColDef<MemberData>[] = [
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

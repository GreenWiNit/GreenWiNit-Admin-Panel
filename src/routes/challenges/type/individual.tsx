import { useIndividualChallenges } from '@/hooks/challenges'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { createFileRoute, Link } from '@tanstack/react-router'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { IndividualChallenge } from '@/api/challenge'
import dayjs from 'dayjs'
import { Button } from '@/components/shadcn/button'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { Separator } from '@/components/shadcn/separator'

export const Route = createFileRoute('/challenges/type/individual')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useIndividualChallenges()

  return (
    <PageContainer>
      <GlobalNavigation />
      <div className="flex flex-col gap-4">
        <PageTitle className="self-start">개인 챌린지 목록</PageTitle>
        <Separator />
        <div className="flex justify-between">
          <Button className="w-fit" asChild>
            <Link to="/challenges/management/verify-status/individual">인증확인</Link>
          </Button>
          <div className="flex gap-2">
            <Button className="w-fit">
              <FilePresentIcon />
              엑셀 받기
            </Button>
            <Button className="w-fit">생성</Button>
          </div>
        </div>
        <div className="flex w-full">
          <DataGrid
            rows={
              data?.result.content.map((challenge) => ({
                ...challenge,
                period: `${dayjs(challenge.beginDateTime).format('YYYY.MM.DD')} ~ ${dayjs(challenge.endDateTime).format('YYYY.MM.DD')}`,
                challengePoint: `${challenge.challengePoint}p`,
                createdDate: dayjs(challenge.createdDate).format('YYYY-MM-DD'),
              })) ?? []
            }
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </PageContainer>
  )
}

const columns: GridColDef<
  Omit<IndividualChallenge, 'challengePoint'> & { period: string; challengePoint: string }
>[] = [
  { field: 'challengeCode', headerName: '챌린지 코드', width: 200 },
  {
    field: 'challengeName',
    headerName: '챌린지 제목',
    width: 300,
  },
  {
    field: 'period',
    headerName: '진행기간',
    width: 300,
  },
  {
    field: 'challengePoint',
    headerName: '포인트',
    width: 150,
  },
  {
    field: 'displayStatus',
    headerName: '전시여부',
    width: 150,
  },
  {
    field: 'createdDate',
    headerName: '생성일',
    width: 150,
  },
]

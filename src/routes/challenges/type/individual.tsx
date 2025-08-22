import { useIndividualChallenges } from '@/hooks/use-challenge'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { challengeApi, type GetIndividualChallengesResponseElement } from '@/api/challenge'
import dayjs from 'dayjs'
import { Button } from '@/components/shadcn/button'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { Separator } from '@/components/shadcn/separator'
import { showMessageIfExists } from '@/lib/error'

export const Route = createFileRoute('/challenges/type/individual')({
  component: IndividualChallenges,
})

function IndividualChallenges() {
  const {
    query: { data },
    paginationModel,
    setPaginationModel,
    defaultDataGridProps,
  } = useIndividualChallenges()
  const navigate = useNavigate()

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex flex-col gap-4">
        <PageTitle className="self-start">개인 챌린지 목록</PageTitle>
        <Separator />
        <div className="flex justify-between">
          <Button className="w-fit" asChild>
            <Link to="/challenges/management/verify-status/individual">인증확인</Link>
          </Button>
          <div className="flex gap-2">
            <Button
              className="w-fit"
              onClick={async () => {
                await challengeApi.downloadIndividualChallenges().catch(showMessageIfExists)
              }}
            >
              <FilePresentIcon />
              엑셀 받기
            </Button>
            <Button className="w-fit" asChild>
              <Link to="/challenges/create" search={{ challengeType: 'individual' }}>
                생성
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex w-full">
          <DataGrid
            {...defaultDataGridProps}
            rows={
              data?.result?.content.map((challenge) => ({
                ...challenge,
                challengePoint: `${challenge.challengePoint}p`,
                createdDate: dayjs(challenge.createdDate).format('YYYY-MM-DD'),
              })) ?? []
            }
            columns={columns}
            onRowClick={(params) => {
              navigate({
                to: '/challenges/$id',
                params: { id: params.row.id },
                search: { challengeType: 'individual' },
              })
            }}
            onPaginationModelChange={setPaginationModel}
            paginationModel={paginationModel}
            rowCount={data?.result?.totalElements ?? 0}
          />
        </div>
      </div>
    </PageContainer>
  )
}

const columns: GridColDef<
  Omit<GetIndividualChallengesResponseElement, 'challengePoint'> & {
    period: string
    challengePoint: string
  }
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

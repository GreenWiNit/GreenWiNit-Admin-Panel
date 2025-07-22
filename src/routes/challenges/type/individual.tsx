import { challengeApi, challengeQueryKeys } from '@/api/challenge'
import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { Challenge } from '@/store/mockedChallengeStore'

export const Route = createFileRoute('/challenges/type/individual')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = useQuery({
    queryKey: challengeQueryKeys.challenges.individual().queryKey,
    queryFn: challengeApi.getIndividualChallenges,
  })

  return (
    <PageContainer>
      <GlobalNavigation />
      <div className="flex flex-col gap-4">
        <PageTitle className="self-start">개인 챌린지 목록</PageTitle>
        <div className="flex w-full">
          <DataGrid
            rows={
              data?.challenges?.map((challenge) => ({
                ...challenge,
                period: `${challenge.beginDateTime} ~ ${challenge.endDateTime}`,
                point: `${challenge.point}p`,
                createdAt: new Date(challenge.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                }),
              })) ?? []
            }
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </PageContainer>
  )
}

const columns: GridColDef<Omit<Challenge, 'point'> & { period: string; point: string }>[] = [
  { field: 'code', headerName: '챌린지 코드', width: 150 },
  {
    field: 'title',
    headerName: '챌린지 제목',
    width: 150,
  },
  {
    field: 'period',
    headerName: '진행기간',
    width: 150,
  },
  {
    field: 'point',
    headerName: '포인트',
    width: 150,
  },
  {
    field: 'participationStatus',
    headerName: '전시여부',
    width: 150,
  },
  {
    field: 'createdAt',
    headerName: '생성일',
    width: 150,
  },
]

import { challengeApi, challengeQueryKeys, type Participant } from '@/api/challenge'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Separator } from '@/components/shadcn/separator'
import { useChallenge, useChallengesParticipants } from '@/hooks/use-challenge'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useId, useMemo } from 'react'

export const Route = createFileRoute('/challenges/$id/')({
  component: ChallengeDetail,
})

function ChallengeDetail() {
  const { id } = Route.useParams()
  const radioInputIdVisible = useId()
  const radioInputIdHidden = useId()
  const { data, isLoading } = useChallenge(Number(id))
  const challenge = data?.result
  const { data: participants } = useChallengesParticipants(Number(id))
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: deleteChallenge } = useMutation({
    mutationFn: () => challengeApi.deleteChallenge(Number(id)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: challengeQueryKeys.challenges.individual.queryKey,
      })
      await queryClient.invalidateQueries({
        queryKey: challengeQueryKeys.challenges.team.queryKey,
      })
      await queryClient.invalidateQueries({
        queryKey: challengeQueryKeys.challenges.challenge(Number(id)).queryKey,
      })
      navigate({ to: '/challenges' })
    },
  })

  const columns = useMemo(() => {
    const isTeamChallenge = data?.result.challengeType === 'TEAM'
    return [
      ...(isTeamChallenge
        ? [
            {
              field: 'teamCode',
              headerName: '팀 코드',
              flex: 1,
            },
          ]
        : []),
      {
        field: 'memberKey',
        headerName: 'MemberKey',
        flex: 1,
      },
      {
        field: 'participationDate',
        headerName: '참여한 날짜',
        flex: 1,
      },
      ...(!isTeamChallenge
        ? [
            {
              field: 'certificationCount',
              headerName: '인증횟수',
              flex: 1,
            },
          ]
        : []),
      ...(isTeamChallenge
        ? [
            {
              field: 'teamSelectionDate',
              headerName: '팀 선택 및 등록 날짜',
              flex: 1,
            },
          ]
        : []),
    ] satisfies GridColDef<Participant>[]
  }, [data?.result.challengeType])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data || !challenge) {
    throw new Error('useChallenge response is falsy')
  }

  return (
    <PageContainer>
      <PageTitle>
        {challenge.challengeType === 'PERSONAL' ? '개인' : '팀'} 챌린지 상세페이지
      </PageTitle>
      <Separator />
      <div className="flex items-center justify-between">
        <h4>기본정보</h4>
        <div className="flex gap-2">
          <Button className="w-fit" asChild>
            <Link to="/challenges/$id/update" params={{ id }}>
              수정
            </Link>
          </Button>
          <Button onClick={() => deleteChallenge()}>삭제</Button>
        </div>
      </div>
      <table className="w-full border-collapse border [&_th,td]:border [&_th,td]:px-4 [&_th,td]:py-2 [&_th,td]:text-left">
        <tbody>
          <tr>
            <th>챌린지 제목</th>
            <td>{challenge.challengeName}</td>
            <th>챌린지 코드</th>
            <td>{challenge.challengeCode}</td>
          </tr>
          <tr>
            <th>카테고리</th>
            <td>{challenge.challengeType === 'PERSONAL' ? '개인' : '팀'}</td>
            <th>진행기간</th>
            <td>
              {dayjs(challenge.beginDateTime).format('YYYY-MM-DD')} ~{' '}
              {dayjs(challenge.endDateTime).format('YYYY-MM-DD')}
            </td>
          </tr>
          <tr>
            <th>전시여부</th>
            <td>
              <RadioGroup value={challenge.displayStatus} disabled className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="VISIBLE" id={radioInputIdVisible}></RadioGroupItem>
                  <Label htmlFor={radioInputIdVisible}>전시</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="HIDDEN" id={radioInputIdHidden}></RadioGroupItem>
                  <Label htmlFor={radioInputIdHidden}>비전시</Label>
                </div>
              </RadioGroup>
            </td>
            <th>챌린지 포인트</th>
            <td>{challenge.challengePoint}</td>
          </tr>
          <tr>
            <th>참여방법</th>
            <td>{challenge.challengeContent}</td>
            <th>이미지</th>
            <td>
              <div className="min-h-40">
                {challenge.challengeImage ? (
                  <img src={challenge.challengeImage} alt="챌린지 이미지" />
                ) : null}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <h4 className="self-start">참여자 정보</h4>
      <DataGrid
        rows={participants?.result.content ?? []}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        columns={columns}
      />
    </PageContainer>
  )
}

import { challengeApi } from '@/api/challenge'
import ParticipantsTable from '@/components/challenges/participants-table'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'
import { useChallenge } from '@/hooks/use-challenge'
import { validateSearchChallengeType } from '@/lib/router'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'
import FilePresentIcon from '@mui/icons-material/FilePresent'
import { showMessageIfExists } from '@/lib/error'
import DisplayStatusToggle from '@/components/challenges/display-status-toggle '
import { invalidateChallenges } from '@/lib/query'

export const Route = createFileRoute('/challenges/$id/')({
  component: ChallengeDetail,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      challengeType: validateSearchChallengeType(search),
    }
  },
})

function ChallengeDetail() {
  const { id } = Route.useParams()
  const searchParams = Route.useSearch()
  const challengeType = searchParams.challengeType
  const { data, isLoading } = useChallenge({
    challengeId: Number(id),
    challengeType,
  })
  const challenge = data?.result
  const navigate = useNavigate()

  const { mutate: deleteChallenge } = useMutation({
    mutationFn: () => challengeApi.deleteChallenge(Number(id)),
    onSuccess: async () => {
      await invalidateChallenges()
      navigate({ to: '/challenges' })
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data || !challenge) {
    throw new Error('useChallenge response is falsy')
  }

  return (
    <PageContainer>
      <PageTitle>{challengeType !== 'individual' ? '팀' : '개인'} 챌린지 상세페이지</PageTitle>
      <Separator />
      <div className="flex items-center justify-between">
        <h4>기본정보</h4>
        <div className="flex gap-2">
          <Button className="w-fit" asChild>
            <Link to="/challenges/$id/update" params={{ id }} search={{ challengeType }}>
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
            <td>{challengeType !== 'individual' ? '팀' : '개인'}</td>
            <th>진행기간</th>
            <td>
              {dayjs(challenge.beginDate).format('YYYY-MM-DD')} ~{' '}
              {dayjs(challenge.endDate).format('YYYY-MM-DD')}
            </td>
          </tr>
          <tr>
            <th>전시여부1</th>
            <td>
              <DisplayStatusToggle
                value={challenge.displayStatus}
                onChange={async (value) => {
                  await challengeApi
                    .patchDisplayStatus({
                      challengeId: Number(id),
                      displayStatus: value,
                      challengeType,
                    })
                    .then(invalidateChallenges)
                }}
                challengeId={Number(id)}
                challengeType={challengeType}
              />
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
      <div className="flex items-center justify-between">
        <h4 className="self-start">참여자 정보</h4>
        <Button
          className="w-fit"
          onClick={async () => {
            await challengeApi
              .downloadParticipantsExcel({
                challengeId: Number(id),
                challengeType,
              })
              .catch(showMessageIfExists)
          }}
        >
          <FilePresentIcon />
          엑셀 받기
        </Button>
      </div>
      <div>
        <ParticipantsTable challengeId={Number(id)} challengeType={challengeType} />
      </div>
    </PageContainer>
  )
}

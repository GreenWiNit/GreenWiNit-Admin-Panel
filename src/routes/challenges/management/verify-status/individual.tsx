import { challengeApi, challengeQueryKeys } from '@/api/challenge'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Label } from '@/components/shadcn/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { useIndividualChallenges } from '@/hooks/challenges'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

// export const Route = createFileRoute('/challenges/management/verify-status/individual')({
export const Route = createFileRoute('/challenges/management/verify-status/individual')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: challenges } = useIndividualChallenges()
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)
  const selectedChallengeIdNumber = selectedChallengeId ? Number(selectedChallengeId) : null
  const { data: participants } = useQuery({
    queryKey: challengeQueryKeys.challenges.individualParticipants(
      selectedChallengeIdNumber ?? undefined,
    ).queryKey,
    queryFn: () => challengeApi.getIndividualChallengeParticipants(selectedChallengeIdNumber),
    select: (data) => data.participants,
    enabled: !!selectedChallengeId,
  })
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null)

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-4">
        <PageTitle className="self-start">개인 챌린지 인증확인</PageTitle>
        <Separator />
        <form className="flex flex-row gap-4">
          <table className="table-auto border-collapse border border-amber-500">
            <tbody className="[&_td,th]:border [&_td,th]:px-1 [&_td,th]:py-2 [&_td,th]:text-sm [&_th]:text-center">
              <tr>
                <th>개인 챌린지 제목</th>
                <td>
                  <Select
                    value={selectedChallengeId ?? ''}
                    onValueChange={(nextValue) => {
                      setSelectedChallengeId(nextValue)
                      setSelectedParticipantId(null)
                    }}
                  >
                    <SelectTrigger className="w-60 truncate">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      {challenges?.challenges.map((challenge) => (
                        <SelectItem key={challenge.id} value={challenge.id.toString()}>
                          <span className="w-48 truncate">{challenge.title}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
              <tr>
                <th>참여자 목록</th>
                <td>
                  <Select
                    value={selectedParticipantId ?? ''}
                    onValueChange={setSelectedParticipantId}
                  >
                    <SelectTrigger className="w-60 truncate text-left">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      {participants?.map((participant) => (
                        <SelectItem key={participant.id} value={participant.id}>
                          <span className="w-48 truncate">{participant.email}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
              <tr>
                <th>포인트</th>
                <td>
                  <div className="flex flex-row justify-center gap-2">
                    <Label>
                      <Checkbox />
                      인증요청
                    </Label>
                    <Label>
                      <Checkbox />
                      지급
                    </Label>
                    <Label>
                      <Checkbox />
                      미지급
                    </Label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Button className="self-end">검색</Button>
        </form>
      </div>
    </PageContainer>
  )
}

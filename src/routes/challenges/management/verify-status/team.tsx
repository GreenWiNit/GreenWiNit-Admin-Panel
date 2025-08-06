import {
  challengeApi,
  challengeQueryKeys,
  type IndividualChallengeWithVerifyStatus,
  type VerifyStatus,
} from '@/api/challenge'
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
import { useTeamChallengeTeams, useTeamChallengeTitles } from '@/hooks/use-challenge'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/challenges/management/verify-status/team')({
  component: TeamVerifyStatus,
})

function TeamVerifyStatus() {
  const { data: challenges } = useTeamChallengeTitles()
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)
  const selectedChallengeIdNumber = selectedChallengeId ? Number(selectedChallengeId) : null
  const { data: teams } = useTeamChallengeTeams(selectedChallengeIdNumber ?? undefined)
  const [selectedTeamCode, setTeamCode] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const [selectedStatuses, setSelectedStatuses] = useState<VerifyStatus[]>([])
  const searchOptions = useMemo(() => {
    const queryListTeamCode =
      selectedTeamCode == null || selectedTeamCode === 'all' ? null : selectedTeamCode
    return {
      callengeId: selectedChallengeIdNumber,
      teamCode: queryListTeamCode,
      statuses: selectedStatuses,
      cursor: null,
    } as const
  }, [selectedChallengeIdNumber, selectedTeamCode, selectedStatuses])

  const { data: verifyStatuses } = useQuery({
    queryKey: challengeQueryKeys.challenges.teamChallengeWithVerifyStatus(searchOptions).queryKey,
    queryFn: () => challengeApi.getTeamChallengeWithVerifyStatus(searchOptions),
  })

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-4">
        <PageTitle className="self-start">팀 챌린지 인증확인</PageTitle>
        <Separator />
        <form
          className="flex flex-row gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            queryClient.invalidateQueries({
              queryKey:
                challengeQueryKeys.challenges.teamChallengeWithVerifyStatus(searchOptions).queryKey,
            })
          }}
        >
          <table className="table-auto border-collapse border border-amber-500">
            <tbody className="[&_td,th]:border [&_td,th]:px-1 [&_td,th]:py-2 [&_td,th]:text-sm [&_th]:text-center">
              <tr>
                <th>팀 챌린지 제목</th>
                <td>
                  <Select
                    value={selectedChallengeId ?? ''}
                    onValueChange={(nextValue) => {
                      setSelectedChallengeId(nextValue)
                      setTeamCode(null)
                    }}
                  >
                    <SelectTrigger className="w-60 truncate">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <span className="w-48 truncate">전체</span>
                      </SelectItem>
                      {challenges?.result?.map((challenge) => (
                        <SelectItem
                          key={challenge.challengeId}
                          value={challenge.challengeId.toString()}
                        >
                          <span className="w-48 truncate">{challenge.challengeName}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
              <tr>
                <th>팀 코드</th>
                <td>
                  <Select value={selectedTeamCode ?? ''} onValueChange={setTeamCode}>
                    <SelectTrigger className="w-60 truncate text-left">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <span className="w-48 truncate">전체</span>
                      </SelectItem>
                      {teams?.map((team) => (
                        <SelectItem key={team.teamCode} value={team.teamCode}>
                          <span className="w-48 truncate">{team.teamName}</span>
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
                      <Checkbox
                        checked={selectedStatuses.includes('PENDING')}
                        onCheckedChange={(checked) => {
                          setSelectedStatuses(checked ? ['PENDING'] : [])
                        }}
                      />
                      인증요청
                    </Label>
                    <Label>
                      <Checkbox
                        checked={selectedStatuses.includes('PAID')}
                        onCheckedChange={(checked) => {
                          setSelectedStatuses(checked ? ['PAID'] : [])
                        }}
                      />
                      지급
                    </Label>
                    <Label>
                      <Checkbox
                        checked={selectedStatuses.includes('REJECTED')}
                        onCheckedChange={(checked) => {
                          setSelectedStatuses(checked ? ['REJECTED'] : [])
                        }}
                      />
                      미지급
                    </Label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Button className="self-end" type="submit">
            검색
          </Button>
        </form>
        <div className="flex w-full">
          <DataGrid
            rows={
              verifyStatuses?.result?.content?.map((challenge) => ({
                ...challenge,
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
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </PageContainer>
  )
}

const columns: GridColDef<IndividualChallengeWithVerifyStatus>[] = [
  {
    field: 'challengeName',
    headerName: '챌린지 제목',
    width: 300,
  },
  { field: 'challengeCode', headerName: '챌린지 코드', width: 200 },
  { field: 'teamCode', headerName: '팀 코드', width: 200 },
  {
    field: 'memberKey',
    headerName: 'MemberKey',
    width: 300,
  },
  {
    field: 'certifiedDate',
    headerName: '인증하기 날짜',
    width: 150,
  },
  // @TODO define cell component, touchable and open new window when clicking
  {
    field: 'certificationImageUrl',
    headerName: '인증 이미지',
    width: 150,
  },
  {
    field: 'certificationReview',
    headerName: '간단한 후기',
    width: 150,
  },
  {
    field: 'status',
    headerName: '포인트 지급 여부',
    width: 150,
  },
]

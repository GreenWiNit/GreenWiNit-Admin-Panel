import { teamApi, teamQueryKeys } from '@/api/team'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Separator } from '@/components/shadcn/separator'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/challenges/$id/teams')({
  component: Teams,
})

function Teams() {
  const [cursor, setCursor] = useState<number | null>(null)
  const { data, isLoading } = useQuery({
    queryKey: teamQueryKeys.team.teams(cursor).queryKey,
    queryFn: (ctx) => teamApi.getTeams(ctx.queryKey[2]),
  })
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const { data: team } = useQuery({
    queryKey: teamQueryKeys.team.team(selectedTeamId ?? undefined).queryKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: (ctx) => teamApi.getTeam(ctx.queryKey[2]!),
  })

  return (
    <PageContainer>
      <PageTitle>팀 상세정보</PageTitle>
      <Separator />
      <h4 className="self-start">팀 목록</h4>
      <DataGrid
        rows={data?.result?.content ?? []}
        columns={teamsColumns}
        loading={isLoading}
        rowCount={data?.result?.totalElements ?? 0}
        onRowCountChange={setCursor}
        paginationModel={{ pageSize: 10, page: cursor ?? 0 }}
        onRowClick={(params) => {
          setSelectedTeamId(params.row.id)
        }}
      />
      <div>
        <h4>팀 상세정보</h4>
        {team == null ? (
          <span>팀 코드를 클릭해주세요.</span>
        ) : (
          <table className="w-full border [&_th]:bg-gray-100 [&_th,td]:border">
            <tbody>
              <tr>
                <th>팀 코드</th>
                <td colSpan={3}>{team.result?.teamCode}</td>
              </tr>
              <tr>
                <th>팀 등록자 Memberkey(팀장)</th>
                <td>{team.result?.leaderMemberKey}</td>
                <th>참가 팀원 Memberkey</th>
                <td>{team.result?.participantMemberKeys}</td>
              </tr>
              <tr>
                <th>팀 제목</th>
                <td>{team.result?.teamTitle}</td>
                <th>날짜</th>
                <td>{team.result?.date}</td>
              </tr>
              <tr>
                <th>시작시간</th>
                <td>{team.result?.startTime}</td>
                <th>종료시간</th>
                <td>{team.result?.endTime}</td>
              </tr>
              <tr>
                <th>장소</th>
                <td colSpan={3}>{team.result?.location}</td>
              </tr>
              <tr>
                <th>설명</th>
                <td colSpan={3}>{team.result?.description}</td>
              </tr>
              <tr>
                <th>오픈채팅방 링크</th>
                <td colSpan={3}>{team.result?.openChatRoomLink}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </PageContainer>
  )
}

const teamsColumns: GridColDef<
  NonNullable<Awaited<ReturnType<typeof teamApi.getTeams>>['result']>['content'][number]
>[] = [
  { field: 'teamCode', headerName: '팀 코드', width: 200 },
  { field: 'teamTitle', headerName: '팀 제목', width: 200 },
  { field: 'registrationDate', headerName: '등록 날짜', width: 200 },
  { field: 'maxParticipants', headerName: '최대인원', width: 200 },
  { field: 'currentParticipants', headerName: '현재참여인원', width: 200 },
  { field: 'recruitmentStatus', headerName: '모집여부', width: 200 },
]

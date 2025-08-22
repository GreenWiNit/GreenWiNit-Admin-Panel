import { teamApi, teamQueryKeys } from '@/api/team'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Separator } from '@/components/shadcn/separator'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { dayjs } from '@/constant/globals'
import { useState } from 'react'
import useQueryDataGrid from '@/hooks/use-query-data-grid'
import { gridPaginationModelToApiParams } from '@/lib/api'

export const Route = createFileRoute('/challenges/$id/teams')({
  component: Teams,
})

function Teams() {
  const { query, paginationModel, setPaginationModel, defaultDataGridProps } = useQueryDataGrid({
    queryKeyWithPageParams: teamQueryKeys.team.teams,
    queryFn: (ctx) => {
      const [, , pageParamsFromQueryKey] = ctx.queryKey
      const { page, size } = gridPaginationModelToApiParams(pageParamsFromQueryKey)
      return teamApi.getTeams({
        size,
        page,
      })
    },
  })
  const data = query.data
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const { data: team } = useQuery({
    queryKey: teamQueryKeys.team.team(selectedTeamId ?? undefined).queryKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: (ctx) => teamApi.getTeam(ctx.queryKey[2]!),
    enabled: selectedTeamId != null,
  })

  return (
    <PageContainer>
      <PageTitle>팀 상세정보</PageTitle>
      <Separator />
      <h4 className="self-start">팀 목록</h4>
      <div className="flex max-h-120 w-full">
        <DataGrid
          {...defaultDataGridProps}
          rows={data?.result?.content ?? []}
          rowCount={data?.result?.totalElements ?? 0}
          onRowClick={(params) => {
            setSelectedTeamId(params.row.id)
          }}
          columns={teamsColumns}
          onPaginationModelChange={setPaginationModel}
          paginationModel={paginationModel}
        />
      </div>
      <div>
        <h4>팀 상세정보</h4>
        {team == null ? (
          <span>팀 코드를 클릭해주세요.</span>
        ) : (
          <table className="w-full border [&_td]:min-w-20 [&_th]:bg-gray-100 [&_th,td]:border">
            <tbody>
              <tr>
                <th>팀 코드</th>
                <td colSpan={3}>{team.result?.groupCode}</td>
              </tr>
              <tr>
                <th>팀 등록자 Memberkey(팀장)</th>
                <td>{team.result?.leaderMemberKey}</td>
                <th>참가 팀원 Memberkey</th>
                <td>{team.result?.participantMemberKeys}</td>
              </tr>
              <tr>
                <th>팀 제목</th>
                <td>{team.result?.groupName}</td>
                <th>날짜</th>
                <td>{team.result?.date}</td>
              </tr>
              <tr>
                <th>시작시간</th>
                <td>
                  {team.result == null
                    ? null
                    : dayjs(team.result?.startTime, 'HH:mm:ss').format('HH:mm')}
                </td>
                <th>종료시간</th>
                <td>
                  {team.result == null
                    ? null
                    : dayjs(team.result?.endTime, 'HH:mm:ss').format('HH:mm')}
                </td>
              </tr>
              <tr>
                <th>장소</th>
                <td colSpan={3}>{team.result?.fullAddress}</td>
              </tr>
              <tr>
                <th>설명</th>
                <td colSpan={3}>{team.result?.description}</td>
              </tr>
              <tr>
                <th>오픈채팅방 링크</th>
                <td colSpan={3}>{team.result?.openChatUrl}</td>
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
  { field: 'groupCode', headerName: '팀 코드', width: 200 },
  { field: 'groupName', headerName: '팀 제목', width: 200 },
  { field: 'challengeDate', headerName: '등록 날짜', width: 200 },
  { field: 'maxParticipants', headerName: '최대인원', width: 200 },
  { field: 'currentParticipants', headerName: '현재참여인원', width: 200 },
  { field: 'recruitmentStatus', headerName: '모집여부', width: 200 },
]

import {
  challengeApi,
  challengeQueryKeys,
  type GetIndividualChallengeParticipantsResponseElement,
  type GetTeamChallengeParticipantsResponseElement,
} from '@/api/challenge'
import useQueryDataGrid from '@/hooks/use-query-data-grid'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'

interface ParticipantsTableProps {
  challengeId: number
  challengeType: 'individual' | 'team'
}
const ParticipantsTable = ({ challengeId, challengeType }: ParticipantsTableProps) => {
  if (challengeType === 'individual') {
    return <IndividualParticipantsTable challengeId={challengeId} />
  }
  return <TeamParticipantsTable challengeId={challengeId} />
}

interface IndividualParticipantsTableProps {
  challengeId: number
}
function IndividualParticipantsTable({ challengeId }: IndividualParticipantsTableProps) {
  const { query, paginationModel, setPaginationModel, defaultDataGridProps } = useQueryDataGrid({
    queryKeyWithPageParams: (pageParams) =>
      challengeQueryKeys.challenges.challengesParticipants({
        challengeId,
        challengeType: 'individual',
        pageSize: pageParams.pageSize,
        page: pageParams.page,
      }),
    queryFn: (ctx) => {
      const [, , , paginationModelFromQueryKey] = ctx.queryKey
      return challengeApi.getIndividualChallengeParticipants({
        challengeId,
        page: paginationModelFromQueryKey.page,
        size: paginationModelFromQueryKey.pageSize,
      })
    },
    select: (data) => data.result,
  })
  const participants = query.data

  return (
    <DataGrid
      {...defaultDataGridProps}
      rows={participants?.content ?? []}
      getRowId={(row) => row.memberKey}
      rowCount={participants?.totalElements ?? 0}
      columns={individualColumns}
      onPaginationModelChange={setPaginationModel}
      paginationModel={paginationModel}
    />
  )
}
const individualColumns: GridColDef<GetIndividualChallengeParticipantsResponseElement>[] = [
  {
    field: 'memberKey',
    headerName: 'MemberKey',
    flex: 1,
  },
  {
    field: 'participatingDate',
    headerName: '참여한 날짜',
    flex: 1,
  },
  {
    field: 'certCount',
    headerName: '인증횟수',
    flex: 1,
  },
]

interface TeamParticipantsTableProps {
  challengeId: number
}
function TeamParticipantsTable({ challengeId }: TeamParticipantsTableProps) {
  const { query, paginationModel, setPaginationModel, defaultDataGridProps } = useQueryDataGrid({
    queryKeyWithPageParams: (pageParams) =>
      challengeQueryKeys.challenges.challengesParticipants({
        challengeId,
        challengeType: 'team',
        pageSize: pageParams.pageSize,
        page: pageParams.page,
      }),
    queryFn: (ctx) => {
      const [, , , paginationModelFromQueryKey] = ctx.queryKey
      return challengeApi.getTeamChallengeParticipants({
        challengeId,
        page: paginationModelFromQueryKey.page,
        size: paginationModelFromQueryKey.pageSize,
      })
    },
    select: (data) => data.result,
  })
  const participants = query.data

  return (
    <DataGrid
      {...defaultDataGridProps}
      rows={participants?.content ?? []}
      getRowId={(row) => `${row.memberKey}-${row.participatingDate}`}
      columns={teamColumns}
      onPaginationModelChange={setPaginationModel}
      paginationModel={paginationModel}
      rowCount={participants?.totalElements ?? 0}
    />
  )
}
const teamColumns: GridColDef<GetTeamChallengeParticipantsResponseElement>[] = [
  {
    field: 'groupCode',
    headerName: '팀 코드',
    flex: 1,
  },
  {
    field: 'memberKey',
    headerName: 'MemberKey',
    flex: 1,
  },
  {
    field: 'participatingDate',
    headerName: '참여한 날짜',
    flex: 1,
  },
  {
    field: 'groupParticipatingDate',
    headerName: '팀 선택 및 등록 날짜',
    flex: 1,
  },
]

export default ParticipantsTable

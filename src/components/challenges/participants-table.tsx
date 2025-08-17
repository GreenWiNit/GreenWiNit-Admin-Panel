import {
  challengeApi,
  challengeQueryKeys,
  type GetIndividualChallengeParticipantsResponseElement,
  type GetTeamChallengeParticipantsResponseElement,
} from '@/api/challenge'
import { DEFAULT_PAGINATION_MODEL } from '@/constant/pagination'
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

interface ParticipantsTableProps {
  challengeId: number
  challengeType: 'individual' | 'team'
}
const ParticipantsTable = ({ challengeId, challengeType }: ParticipantsTableProps) => {
  const [pageParams, setPageParams] = useState<GridPaginationModel>(DEFAULT_PAGINATION_MODEL)
  if (challengeType === 'individual') {
    return (
      <IndividualParticipantsTable
        challengeId={challengeId}
        pageParams={pageParams}
        setPageParams={setPageParams}
      />
    )
  }
  return (
    <TeamParticipantsTable
      challengeId={challengeId}
      pageParams={pageParams}
      setPageParams={setPageParams}
    />
  )
}

interface IndividualParticipantsTableProps {
  challengeId: number
  pageParams: GridPaginationModel
  setPageParams: (pageParams: GridPaginationModel) => void
}
function IndividualParticipantsTable({
  challengeId,
  pageParams,
  setPageParams,
}: IndividualParticipantsTableProps) {
  const { data: participants } = useQuery({
    queryKey: challengeQueryKeys.challenges.challengesParticipants({
      challengeId,
      challengeType: 'individual',
      pageParams,
    }).queryKey,
    queryFn: () =>
      challengeApi.getIndividualChallengeParticipants({
        challengeId,
        page: pageParams.page,
        size: pageParams.pageSize,
      }),
    select: (data) => data.result,
  })
  return (
    <DataGrid
      rows={participants?.content ?? []}
      getRowId={(row) => row.memberKey}
      initialState={{
        pagination: {
          paginationModel: DEFAULT_PAGINATION_MODEL,
        },
      }}
      columns={individualColumns}
      onPaginationModelChange={setPageParams}
      paginationModel={pageParams}
      rowCount={participants?.totalElements ?? 0}
      paginationMode="server"
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
  pageParams: GridPaginationModel
  setPageParams: (pageParams: GridPaginationModel) => void
}
function TeamParticipantsTable({
  challengeId,
  pageParams,
  setPageParams,
}: TeamParticipantsTableProps) {
  const { data: participants } = useQuery({
    queryKey: challengeQueryKeys.challenges.challengesParticipants({
      challengeId,
      challengeType: 'team',
      pageParams,
    }).queryKey,
    queryFn: () =>
      challengeApi.getTeamChallengeParticipants({
        challengeId,
        page: pageParams.page,
        size: pageParams.pageSize,
      }),
    select: (data) => data.result,
  })
  return (
    <DataGrid
      rows={participants?.content ?? []}
      initialState={{
        pagination: {
          paginationModel: DEFAULT_PAGINATION_MODEL,
        },
      }}
      columns={teamColumns}
      onPaginationModelChange={setPageParams}
      paginationModel={pageParams}
      rowCount={participants?.totalElements ?? 0}
      paginationMode="server"
    />
  )
}
const teamColumns: GridColDef<GetTeamChallengeParticipantsResponseElement>[] = [
  {
    field: 'teamCode',
    headerName: '팀 코드',
    flex: 1,
  },
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
  {
    field: 'teamSelectionDate',
    headerName: '팀 선택 및 등록 날짜',
    flex: 1,
  },
]

export default ParticipantsTable

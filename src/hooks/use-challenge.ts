import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { challengeApi, challengeQueryKeys } from '@/api/challenge'
import { omit } from 'es-toolkit'
import useQueryDataGrid from './use-query-data-grid'
import { gridPaginationModelToApiParams } from '@/lib/api'

export const useIndividualChallenges = (
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof challengeApi.getIndividualChallenges>>,
      unknown,
      Awaited<ReturnType<typeof challengeApi.getIndividualChallenges>>,
      ReturnType<typeof challengeQueryKeys.challenges.individualChallenges>['queryKey']
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const { query, paginationModel, setPaginationModel } = useQueryDataGrid({
    ...options,
    queryKeyWithPageParams: challengeQueryKeys.challenges.individualChallenges,
    queryFn: (ctx) => {
      const [, , , gridPaginationModel] = ctx.queryKey
      return challengeApi.getIndividualChallenges(
        gridPaginationModelToApiParams(gridPaginationModel),
      )
    },
  })

  return {
    query,
    paginationModel,
    setPaginationModel,
  }
}

export const useTeamChallenges = (
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof challengeApi.getTeamChallenges>>,
      unknown,
      Awaited<ReturnType<typeof challengeApi.getTeamChallenges>>,
      ReturnType<typeof challengeQueryKeys.challenges.teamChallenges>['queryKey']
    >,
    'queryKey' | 'queryFn'
  > & {
    pageParams: {
      page?: number
      size?: number
    }
  },
) => {
  return useQuery({
    ...(options ? omit(options, ['pageParams']) : {}),
    queryKey: challengeQueryKeys.challenges.teamChallenges({
      page: options?.pageParams?.page,
      size: options?.pageParams?.size,
    }).queryKey,
    queryFn: (ctx) => {
      const [, , , { page, size }] = ctx.queryKey
      return challengeApi.getTeamChallenges({ page, size })
    },
  })
}

export const useChallenge = ({
  challengeId,
  challengeType,
}: {
  challengeId: number
  challengeType: 'individual' | 'team'
}) => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.challenge({ challengeId, challengeType }).queryKey,
    queryFn: (ctx) => {
      const [, , { challengeId, challengeType }] = ctx.queryKey
      if (challengeType !== 'individual') {
        return challengeApi.getTeamChallenge(challengeId)
      }

      return challengeApi.getIndividualChallenge(challengeId)
    },
  })
}

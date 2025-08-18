import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { challengeApi, challengeQueryKeys } from '@/api/challenge'
import { omit } from 'es-toolkit'

export const useIndividualChallenges = (
  options?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof challengeApi.getIndividualChallenges>>,
      unknown,
      Awaited<ReturnType<typeof challengeApi.getIndividualChallenges>>,
      ReturnType<typeof challengeQueryKeys.challenges.individualChallenges>['queryKey']
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
    queryKey: challengeQueryKeys.challenges.individualChallenges({
      page: options?.pageParams?.page,
      size: options?.pageParams?.size,
    }).queryKey,
    queryFn: (ctx) => {
      const [, , , { page, size }] = ctx.queryKey
      return challengeApi.getIndividualChallenges({
        page,
        size,
      })
    },
  })
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

export const useTeamChallengeTitles = () => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.teamTitles.queryKey,
    queryFn: challengeApi.getTeamChallengeTitles,
  })
}

export const useTeamChallengeTeams = (challengeId?: number) => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.teamChallengeTeams(challengeId).queryKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => challengeApi.getTeamChallengeTeams(challengeId!),
    enabled: !!challengeId,
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
      // challengeApi.getChallenge({ challengeId, challengeType })
      const [, , { challengeId, challengeType }] = ctx.queryKey
      if (challengeType !== 'individual') {
        return challengeApi.getTeamChallenge(challengeId)
      }

      return challengeApi.getIndividualChallenge(challengeId)
    },
  })
}

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { challengeApi, challengeQueryKeys } from '@/api/challenge'

export const useIndividualChallenges = (
  options?: Omit<
    UseQueryOptions<ReturnType<typeof challengeApi.getIndividualChallenges>>,
    'queryKey' | 'queryFn'
  > & {
    pageParams: {
      page?: number
      size?: number
    }
  },
) => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.individual(
      options?.pageParams?.page,
      options?.pageParams?.size,
    ).queryKey,
    queryFn: (ctx) => {
      const [, , , { page, size }] = ctx.queryKey
      return challengeApi.getIndividualChallenges({
        page,
        size,
      })
    },
  })
}

export const useIndividualChallengeTitles = () => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.individualTitles.queryKey,
    queryFn: challengeApi.getIndividualChallengeTitles,
  })
}

export const useTeamChallenges = (cursor?: number | null) => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.teamChallenges(cursor).queryKey,
    queryFn: () => challengeApi.getTeamChallenges(cursor),
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

export const useChallenge = (challengeId: number) => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.challenge(challengeId).queryKey,
    queryFn: () => challengeApi.getChallenge(challengeId),
  })
}

export const useChallengesParticipants = (challengeId: number) => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.challengesParticipants(challengeId).queryKey,
    queryFn: () => challengeApi.getChallengesParticipants(challengeId),
  })
}

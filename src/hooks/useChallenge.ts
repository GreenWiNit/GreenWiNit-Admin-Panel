import { useQuery } from '@tanstack/react-query'
import { challengeApi, challengeQueryKeys } from '@/api/challenge'

export const useIndividualChallenges = () => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.individual.queryKey,
    queryFn: challengeApi.getIndividualChallenges,
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

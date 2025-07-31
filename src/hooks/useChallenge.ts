import { useQuery } from '@tanstack/react-query'
import { challengeApi, challengeQueryKeys } from '@/api/challenge'

export const useIndividualChallenges = () => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.individual().queryKey,
    queryFn: challengeApi.getIndividualChallenges,
  })
}

export const useIndividualChallengeTitles = () => {
  return useQuery({
    queryKey: challengeQueryKeys.challenges.individualTitles().queryKey,
    queryFn: challengeApi.getIndividualChallengeTitles,
  })
}

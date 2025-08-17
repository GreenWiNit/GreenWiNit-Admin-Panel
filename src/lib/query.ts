import { CHALLENGES_TOP_KEY } from '@/api/challenge'
import { queryClient } from '@/constant/globals'

export async function invalidateChallenges() {
  await queryClient.invalidateQueries({
    queryKey: [CHALLENGES_TOP_KEY],
  })
}

import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from './constant'
import type { Challenge } from '@/store/mockedChallengeStore'

export const challengeApi = {
  getIndividualChallenges: async () => {
    return await fetch(`${API_URL}/admin/challenges/type/individual`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json() as Promise<{ challenges: Challenge[] }>)
  },
}

const challengeKey = createQueryKeys('challenges', {
  individual: () => ['individual'],
})

export const challengeQueryKeys = mergeQueryKeys(challengeKey)

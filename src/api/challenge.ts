import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from './constant'
import type { Challenge, Participant } from '@/store/mockedChallengeStore'

export const challengeApi = {
  getIndividualChallenges: async () => {
    return await fetch(`${API_URL}/admin/challenges/type/individual`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json() as Promise<{ challenges: Challenge[] }>)
  },
  getIndividualChallengeParticipants: async (challengeId?: number | null) => {
    return await fetch(`${API_URL}/admin/challenges/type/individual/${challengeId}/participants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json() as Promise<{ participants: Participant[] }>)
  },
}

const challengeKey = createQueryKeys('challenges', {
  individual: () => ['individual'],
  individualParticipants: (challengeId?: number) =>
    ['individual', challengeId, 'participants'] as const,
})

export const challengeQueryKeys = mergeQueryKeys(challengeKey)

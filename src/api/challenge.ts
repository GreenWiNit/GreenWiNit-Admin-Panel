import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from '@/constant/network'
import type { Participant } from '@/store/mockedChallengeStore'

export interface IndividualChallenge {
  id: number
  /**
   * 'CH-P-20250726-132731-699N'
   */
  challengeCode: string
  challengeName: string
  challengePoint: number
  /**
   * '2025-07-26T13:27:21.147'
   */
  beginDateTime: string
  /**
   * '2025-07-26T13:27:21.147'
   */
  endDateTime: string
  displayStatus: 'VISIBLE' | 'HIDDEN'
  /**
   * '2025-07-26T13:27:21.147311'
   */
  createdDate: string
}

export const challengeApi = {
  getIndividualChallenges: async () => {
    return await fetch(`${API_URL}/admin/challenges/personal`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<{
          message: string
          result: {
            hasNext: boolean
            nextCursor: string | null
            content: Array<IndividualChallenge>
          }
          success: boolean
        }>,
    )
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

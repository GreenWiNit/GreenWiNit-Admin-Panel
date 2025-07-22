import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * It's from GET /api/challenges/{chlgNo}
 */
export interface Challenge {
  id: number
  /**
   * exmaple: CH-P-20250602-003
   */
  code: string
  title: string
  /**
   * ISO 8601 format
   */
  beginDateTime: string
  /**
   * ISO 8601 format
   */
  endDateTime: string
  imageUrl: string
  point: number
  /**
   * NOT_LOGGED_IN ?
   */
  participationStatus: string
  createdAt: string
}

interface MockedChallengeStoreState {
  challenges: Challenge[]
  setChallenges: (challenges: Challenge[]) => void
}

export const mockedChallengeStore = create<MockedChallengeStoreState>()(
  devtools(
    persist(
      (set) => ({
        challenges: [
          {
            id: 1,
            code: 'CH-P-20250602-003',
            title: 'Challenge 1',
            beginDateTime: '2021-01-01T00:00:00Z',
            endDateTime: '2021-01-01T00:00:00Z',
            imageUrl: 'https://example.com/image.png',
            point: 100,
            participationStatus: 'ACTIVE',
            createdAt: '2021-01-01T00:00:00Z',
          } satisfies Challenge,
        ],
        setChallenges: (challenges: Challenge[]) => {
          set({ challenges })
        },
      }),
      {
        name: 'challenges',
      },
    ),
  ),
)

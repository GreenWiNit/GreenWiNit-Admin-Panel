import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { faker } from '@faker-js/faker'

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

const generateChallenge = (): Challenge => {
  return {
    id: faker.number.int(),
    code: `CH-P-${faker.date.past().toISOString().split('T')[0]}-${faker.number.int({ min: 1, max: 1000 })}`,
    title: faker.lorem.sentence(),
    beginDateTime: faker.date.past().toISOString(),
    endDateTime: faker.date.future().toISOString(),
    imageUrl: 'https://example.com/image.png',
    point: 100,
    participationStatus: 'ACTIVE',
    createdAt: '2021-01-01T00:00:00Z',
  } satisfies Challenge
}

export const mockedChallengeStore = create<MockedChallengeStoreState>()(
  devtools(
    persist(
      (set) => ({
        challenges: Array.from({ length: 10 }, generateChallenge),
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

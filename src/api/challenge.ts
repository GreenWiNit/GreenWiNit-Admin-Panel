import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from '@/constant/network'
import { stringify } from '@/lib/query-string'

export type DisplayStatus = 'VISIBLE' | 'HIDDEN'

export interface Challenge {
  id: number
  /**
   * 'CH-P-20250726-132731-699N'
   */
  challengeCode: string
  challengeName: string
  challengeStatus: 'PROCEEDING'
  challengeType: 'PERSONAL' | 'TEAM'
  challengePoint: number
  /**
   * '2025-07-26T13:27:21.147'
   */
  beginDateTime: string
  /**
   * '2025-07-26T13:27:21.147'
   */
  endDateTime: string
  displayStatus: DisplayStatus
  challengeImage: string
  /**
   * 참여방법
   */
  challengeContent: string
  /**
   * '2025-07-26T13:27:21.147311'
   */
  createdDate: string
}

export type GetIndividualChallengesResponseElement = Pick<
  Challenge,
  | 'id'
  | 'challengeCode'
  | 'challengeName'
  | 'challengePoint'
  | 'beginDateTime'
  | 'endDateTime'
  | 'displayStatus'
  | 'createdDate'
>

export type GetTeamChallengesResponseElement = Challenge & {
  participantCount: number
  currentGroupCount: number
  maxGroupCount: number
}

export interface Participant {
  memberId: number
  /**
   * ex) google_3421
   */
  memberKey: string
  participationDate: string
  /**
   * ex) T-20250109-143523-C8NQ
   */
  teamCode: string | null
  teamSelectionDate: string | null
  certificationCount: number
}

export type VerifyStatus = 'PENDING' | 'PAID' | 'REJECTED'

export interface IndividualChallengeWithVerifyStatus {
  id: number
  /**
   * ex) google foo
   */
  memberKey: string
  memberNickname: string
  memberEmail: string
  certificationImageUrl: string
  certificationReview: string
  certifiedDate: string
  status: VerifyStatus
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
            content: Array<GetIndividualChallengesResponseElement>
          }
          success: boolean
        }>,
    )
  },
  getIndividualChallengeParticipantKeys: async (challengeId?: number | null) => {
    return await fetch(`${API_URL}/admin/challenges/${challengeId}/participants-memberkeys`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<{
          success: true
          message: 'string'
          result: Array<{
            memberKey: string
            nickname: string
          }>
        }>,
    )
  },
  getIndividualChallengeTitles: async () => {
    return await fetch(`${API_URL}/admin/challenges/personal-titles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<{
          success: true
          message: 'string'
          result: Array<{
            challengeId: number
            challengeName: string
            /**
             * @deprecated 의미없으니 사용하지 말것
             */
            challengeType: 'PERSONAL'
          }>
        }>,
    )
  },
  getIndividualChallengeWithVerifyStatus: async (params: {
    callengeId: number | null
    memberKey: number | null
    statuses: VerifyStatus[] | readonly VerifyStatus[] | null
    cursor: number | null
  }) => {
    return await fetch(`${API_URL}/admin/personal-certifications?${stringify(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<{
          success: boolean
          message: string
          result: {
            hasNext: boolean
            nextCursor: string | null
            content: Array<IndividualChallengeWithVerifyStatus>
          }
        }>,
    )
  },
  getTeamChallenges: async (cursor?: number | null) => {
    return await fetch(`${API_URL}/admin/challenges/team?${stringify({ cursor })}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return res.json() as Promise<{
        success: boolean
        message: string
        result:
          | {
              hasNext: true
              nextCursor: number
              content: GetTeamChallengesResponseElement[]
            }
          | {
              hasNext: false
              nextCursor: null
              content: GetTeamChallengesResponseElement[]
            }
      }>
    })
  },
  getChallenge: async (challengeId: number) => {
    return await fetch(`${API_URL}/admin/challenges/${challengeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return res.json() as Promise<{
        success: boolean
        message: string
        result: Challenge
      }>
    })
  },
  createIndividualChallenge: async (params: {
    challengeName: string
    challengePoint: number
    challengeType: 'PERSONAL' | 'TEAM'
    beginDateTime: string
    endDateTime: string
    displayStatus: DisplayStatus
    challengeImageUrl: string
    challengeContent: string
    maxGroupCount: number
  }) => {
    return await fetch(`${API_URL}/admin/challenges`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<{
          success: boolean
          message: string
          /** inserted id */
          result?: number
        }>,
    )
  },
  getChallengesParticipants: async (challengeId?: number | null) => {
    return await fetch(`${API_URL}/admin/challenges/${challengeId}/participants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<{
          success: true
          message: 'string'
          result:
            | {
                hasNext: true
                nextCursor: number
                content: Participant[]
              }
            | {
                hasNext: false
                nextCursor: null
                content: Participant[]
              }
        }>,
    )
  },
}

const challengeKey = createQueryKeys('challenges', {
  individual: ['individual'],
  individualTitles: ['individual', 'titles'],
  individualWithVerifyStatus: (
    params: Parameters<typeof challengeApi.getIndividualChallengeWithVerifyStatus>[0],
  ) => ['individual', 'with-verify-status', params] as const,
  individualParticipantKeys: (challengeId?: number) =>
    ['individual', challengeId, 'participants', 'keys'] as const,
  team: ['team'],
  teamChallenges: (cursor?: number | null) => ['team', cursor ?? undefined] as const,
  challenge: (challengeId: number) => [challengeId] as const,
  challengesParticipants: (challengeId?: number) => [challengeId, 'participants'] as const,
})

export const challengeQueryKeys = mergeQueryKeys(challengeKey)

import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from '@/constant/network'
import { stringify } from '@/lib/query-string'
import { downloadExcel, throwResponseStatusThenChaining } from '@/lib/network'
import type { ApiResponse, CommonFailureMessageWithAuth, PaginatedResponse } from '@/types/api'

export const challengeApi = {
  // @MEMO v2 작업완료
  getIndividualChallenges: async (
    pageParams: {
      page: number | undefined
      size: number | undefined
    } = {
      page: undefined,
      size: undefined,
    },
  ) => {
    return await fetch(`${API_URL}/admin/challenges/personal?${stringify(pageParams)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<
          PaginatedResponse<
            GetIndividualChallengesResponseElement,
            '개인 챌린지 목록 조회에 성공했습니다.',
            CommonFailureMessageWithAuth
          >
        >,
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
  // @MEMO v2 작업완료
  getTeamChallenges: async (
    pageParams: {
      page: number | undefined
      size: number | undefined
    } = {
      page: undefined,
      size: undefined,
    },
  ) => {
    return await fetch(`${API_URL}/admin/challenges/team?${stringify(pageParams)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      return res.json() as Promise<
        PaginatedResponse<
          GetTeamChallengesResponseElement,
          '팀 챌린지 목록 조회에 성공했습니다.',
          CommonFailureMessageWithAuth
        >
      >
    })
  },
  getTeamChallengeTitles: async () => {
    return await fetch(`${API_URL}/admin/challenges/team-titles`, {
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
            challengeType: 'TEAM'
          }>
        }>,
    )
  },
  getTeamChallengeTeams: async (challengeId: number) => {
    return await fetch(`${API_URL}/admin/challenges/${challengeId}/group-codes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json() as Promise<{
          success: boolean
          message: string
          result: Array<{
            groupCode: string
            groupName: string
            participantCount: number
          }>
        }>
      })
      .then((res) => {
        return res.result.map((item) => ({
          ...item,
          teamCode: item.groupCode,
          teamName: item.groupName,
        }))
      })
  },
  getTeamChallengeWithVerifyStatus: async (params: {
    callengeId: number | null
    teamCode: string | null
    statuses: VerifyStatus[] | readonly VerifyStatus[] | null
    cursor: number | null
  }) => {
    return await fetch(`${API_URL}/admin/team-certifications?${stringify(params)}`, {
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
            content: Array<TeamChallengeWithVerifyStatus>
          }
        }>,
    )
  },
  // @MEMO v2 작업완료
  getIndividualChallenge: async (challengeId: number) => {
    return await fetch(`${API_URL}/admin/challenges/personal/${challengeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(throwResponseStatusThenChaining)
      .then((res) => {
        return res.json() as Promise<ApiResponse<CommonChallenge>>
      })
  },
  // @MEMO v2 작업완료
  getTeamChallenge: async (challengeId: number) => {
    return await fetch(`${API_URL}/admin/challenges/team/${challengeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(throwResponseStatusThenChaining)
      .then((res) => {
        return res.json() as Promise<ApiResponse<CommonChallenge>>
      })
  },
  createIndividualChallenge: async (params: {
    challengeName: string
    challengePoint: number
    beginDate: string
    endDate: string
    challengeContent: string
    challengeImageUrl: string
  }) => {
    return await fetch(`${API_URL}/admin/challenges/personal`, {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        beginDateTime: `${params.beginDate}T00:00:00`,
        endDateTime: `${params.endDate}T00:00:00`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(throwResponseStatusThenChaining)
      .then((res) => {
        return res.json() as Promise<ApiResponse<number>>
      })
  },
  createTeamChallenge: async (params: {
    challengeName: string
    challengePoint: number
    beginDate: string
    endDate: string
    challengeContent: string
    challengeImageUrl: string
  }) => {
    return await fetch(`${API_URL}/admin/challenges/team`, {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        beginDateTime: `${params.beginDate}T00:00:00`,
        endDateTime: `${params.endDate}T00:00:00`,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(throwResponseStatusThenChaining)
      .then((res) => {
        return res.json() as Promise<ApiResponse<number>>
      })
  },
  updateChallenge: async (params: {
    id: number
    challengeName: string
    challengePoint: number
    beginDateTime: string
    endDateTime: string
    challengeContent: string
  }) => {
    return await fetch(`${API_URL}/admin/challenges/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<{
          success: boolean
          message: string
          result: null
        }>,
    )
  },
  changeChallengeVisibility: async (challengeId: number, displayStatus: DisplayStatus) => {
    return await fetch(`${API_URL}/admin/challenges/${challengeId}/visibility`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ displayStatus }),
    }).then(throwResponseStatusThenChaining)
  },
  deleteChallenge: async (challengeId: number) => {
    return challengeApi.changeChallengeVisibility(challengeId, 'HIDDEN')
  },
  // @MEMO v2 작업완료
  getIndividualChallengeParticipants: async (params: {
    challengeId: number
    page: number | undefined
    size: number | undefined
  }) => {
    const { challengeId, page, size } = params

    return await fetch(
      `${API_URL}/admin/challenges/personal/${challengeId}/participants?${stringify({ page, size })}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(
      (res) =>
        res.json() as Promise<PaginatedResponse<GetIndividualChallengeParticipantsResponseElement>>,
    )
  },
  // @MEMO v2 작업완료
  downloadIndividualChallenges: async () => {
    return await fetch(`${API_URL}/admin/challenges/personal/excel`, {
      method: 'GET',
    })
      .then(throwResponseStatusThenChaining)
      .then(downloadExcel)
  },
  // @MEMO v2 작업완료
  getTeamChallengeParticipants: async (params: {
    challengeId: number
    page: number | undefined
    size: number | undefined
  }) => {
    const { challengeId, page, size } = params

    return await fetch(
      `${API_URL}/admin/challenges/${challengeId}/groups/participants?${stringify({ page, size })}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(
      (res) =>
        res.json() as Promise<PaginatedResponse<GetTeamChallengeParticipantsResponseElement>>,
    )
  },
  // @MEMO v2 작업완료
  downloadTeamChallenges: async () => {
    return await fetch(`${API_URL}/admin/challenges/team/excel`, {
      method: 'GET',
    })
      .then(throwResponseStatusThenChaining)
      .then(downloadExcel)
  },
  // @MEMO v2 작업완료
  downloadParticipantsExcel: async ({
    challengeId,
    challengeType,
  }: {
    challengeId: number
    challengeType: 'individual' | 'team'
  }) => {
    if (challengeType === 'team') {
      return await fetch(`${API_URL}/admin/challenges/${challengeId}/groups/participants/excel`)
        .then(throwResponseStatusThenChaining)
        .then(downloadExcel)
    }
    return await fetch(`${API_URL}/admin/challenges/personal/${challengeId}/participants/excel`, {
      method: 'GET',
    })
      .then(throwResponseStatusThenChaining)
      .then(downloadExcel)
  },
  // @MEMO v2 작업완료
  patchDisplayStatus: async ({
    challengeId,
    displayStatus,
    challengeType,
  }: {
    challengeId: number
    displayStatus: DisplayStatus
    challengeType: 'individual' | 'team'
  }) => {
    const displayStatusToPath = displayStatus === 'VISIBLE' ? 'show' : 'hide'
    if (challengeType !== 'team') {
      return await fetch(
        `${API_URL}/admin/challenges/personal/${challengeId}/${displayStatusToPath}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ displayStatus }),
        },
      ).then(throwResponseStatusThenChaining)
    }
    return await fetch(`${API_URL}/admin/challenges/team/${challengeId}/${displayStatusToPath}`, {
      method: 'PATCH',
      body: JSON.stringify({ displayStatus }),
    }).then(throwResponseStatusThenChaining)
  },
}

export const CHALLENGES_TOP_KEY = 'challenges' as const
const challengeKey = createQueryKeys(CHALLENGES_TOP_KEY, {
  individual: ['individual'],
  individualChallenges: (pageParams: { page?: number | undefined; size?: number | undefined }) =>
    ['individual', pageParams] as const,
  individualTitles: ['individual', 'titles'],
  individualWithVerifyStatus: (
    params: Parameters<typeof challengeApi.getIndividualChallengeWithVerifyStatus>[0],
  ) => ['individual', 'with-verify-status', params] as const,
  individualParticipantKeys: (challengeId?: number) =>
    ['individual', challengeId, 'participants', 'keys'] as const,
  team: ['team'],
  teamChallenges: (pageParams: { page: number | undefined; size: number | undefined }) =>
    ['team', pageParams] as const,
  teamTitles: ['team', 'titles'] as const,
  teamChallengeTeams: (challengeId?: number) => ['team', challengeId, 'teams'] as const,
  teamChallengeWithVerifyStatus: (
    params: Parameters<typeof challengeApi.getTeamChallengeWithVerifyStatus>[0],
  ) => ['team', 'with-verify-status', params] as const,
  challenge: (params: { challengeId: number; challengeType: 'individual' | 'team' }) =>
    [params] as const,
  challengesParticipants: (params: {
    challengeId?: number
    challengeType?: 'individual' | 'team'
    pageParams:
      | {
          page?: number
          size?: number
        }
      | undefined
  }) => ['participants', params] as const,
})

export type DisplayStatus = 'VISIBLE' | 'HIDDEN'

export interface CommonChallenge {
  id: number
  /**
   * CH-P-20250109-143521-A3FV
   */
  challengeCode: string
  challengeName: string
  challengeType: 'PERSONAL' | 'TEAM'
  challengePoint: number
  beginDate: string
  endDate: string
  displayStatus: DisplayStatus
  challengeImage: string
  challengeContent: string
}

export interface GetIndividualChallengesResponseElement {
  id: number
  /**
   * CH-P-20250109-143521-A3FV
   */
  challengeCode: string
  challengeName: string
  /**
   * '2025-07-26'
   */
  beginDate: string
  /**
   * '2025-07-26'
   */
  endDate: string
  challengePoint: number
  displayStatus: DisplayStatus
  createdDate: string
  /**
   * @deprecated 글쎄 쓸일이 있을까
   */
  period: string
}

export interface GetTeamChallengesResponseElement extends GetIndividualChallengesResponseElement {
  teamCount: number
}

export interface GetIndividualChallengeParticipantsResponseElement {
  memberKey: string
  participationDate: string
  certCount: number
}

export interface GetTeamChallengeParticipantsResponseElement {
  /**
   * T-20250109-143523-C8NQ
   */
  groupCode: string
  memberKey: string
  participationDate: string
  groupParticipatingDate: string
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
  challengeId: number
  /**
   * CH-P-20250109-143521-A3FV
   */
  challengeCode: string
  challengeTitle: string
}

export interface TeamChallengeWithVerifyStatus {
  id: number
  /**
   * ex) google foo
   * @CHECK swagger에서는 memberId
   */
  memberKey: string
  memberNickname: string
  memberEmail: string
  certificationImageUrl: string
  certificationReview: string
  certifiedDate: string
  status: VerifyStatus
}

export const challengeQueryKeys = mergeQueryKeys(challengeKey)

import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from '@/constant/network'
import { stringify } from '@/lib/query-string'
import { downloadExcel, throwResponseStatusThenChaining } from '@/lib/network'
import type { ApiResponse, CommonFailureMessageWithAuth, PaginatedResponse } from '@/types/api'
import { omit } from 'es-toolkit'

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
  // @MEMO v2 작업완료
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
        displayStatus: 'VISIBLE',
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
  // @MEMO v2 작업완료
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
        displayStatus: 'VISIBLE',
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
  // @MEMO v2 작업완료
  updateChallenge: async (params: {
    challengeId: number
    challengeName: string
    challengePoint: number
    beginDate: string
    endDate: string
    challengeContent: string
    challengeImageUrl: string
    challengeType: 'individual' | 'team'
  }) => {
    const { challengeType, challengeId, ...bodyPayload } = params
    return await fetch(
      `${API_URL}/admin/challenges/${challengeType === 'team' ? 'team' : 'personal'}/${challengeId}`,
      {
        method: 'PUT',
        body: JSON.stringify(bodyPayload),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => res.json() as Promise<ApiResponse<never>>)
  },
  // @MEMO v2 작업완료
  deleteChallenge: async (challengeId: number, challengeType: 'individual' | 'team') => {
    return challengeApi.patchDisplayStatus({
      challengeId,
      displayStatus: 'HIDDEN',
      challengeType,
    })
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
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ).then(throwResponseStatusThenChaining)
    }
    return await fetch(`${API_URL}/admin/challenges/team/${challengeId}/${displayStatusToPath}`, {
      method: 'PATCH',
      body: JSON.stringify({ displayStatus }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(throwResponseStatusThenChaining)
  },
  // @MEMO v2 작업완료
  getChallengesWithVerifyStatus: async (params: {
    challengeName?: string | null
    groupCode?: string | null
    memberKey?: string | null
    status?: CertificationStatus
    challengeType: 'individual' | 'team'
    page?: number | undefined
    size?: number | undefined
  }) => {
    return await fetch(
      `${API_URL}/admin/certifications/challenges?${stringify(omit({ ...params, type: params.challengeType === 'individual' ? 'P' : 'T' }, ['challengeType']), { skipNull: true, skipEmptyString: true })}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then(throwResponseStatusThenChaining)
      .then((res) => {
        return res.json() as Promise<PaginatedResponse<ChallengeWithVerifyStatus>>
      })
  },
  // @MEMO v2 작업완료
  patchVerifyStatus: async ({
    certificationIds,
    status,
  }: {
    certificationIds: number[]
    status: Omit<CertificationStatus, '인증 요청'>
  }) => {
    if (certificationIds.length === 0) {
      return
    }
    return await fetch(
      `${API_URL}/admin/certifications/challenges/${status === '지급' ? 'approve' : 'reject'}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ certificationIds }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then(throwResponseStatusThenChaining)
  },
}

export const CHALLENGES_TOP_KEY = 'challenges' as const
const challengeKey = createQueryKeys(CHALLENGES_TOP_KEY, {
  individual: [undefined] as const,
  individualChallenges: (pageParams: { page?: number | undefined; size?: number | undefined }) =>
    ['individual', pageParams] as const,
  individualWithVerifyStatus: (
    params: Omit<Parameters<typeof challengeApi.getChallengesWithVerifyStatus>[0], 'challengeType'>,
  ) => ['individual', 'with-verify-status', params] as const,
  team: ['team'],
  teamChallenges: (pageParams: { page: number | undefined; size: number | undefined }) =>
    ['team', pageParams] as const,
  teamWithVerifyStatus: (
    params: Omit<Parameters<typeof challengeApi.getChallengesWithVerifyStatus>[0], 'challengeType'>,
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
  participatingDate: string
  certCount: number
}

export interface GetTeamChallengeParticipantsResponseElement {
  /**
   * T-20250109-143523-C8NQ
   */
  groupCode: string
  memberKey: string
  participatingDate: string
  groupParticipatingDate: string
}

export type VerifyStatus = 'PENDING' | 'PAID' | 'REJECTED'
export type CertificationStatus = '인증 요청' | '지급' | '미지급'

export interface ChallengeWithVerifyStatus {
  id: number
  challenge: {
    id: number
    name: string
    code: string
    image: string
    point: number
  } & (
    | {
        type: 'P'
      }
    | {
        groupCode: string
        type: 'T'
      }
  )
  member: {
    id: number
    key: string
  }
  certifiedDate: string
  imageUrl: string
  review: string
  status: CertificationStatus
}

export const challengeQueryKeys = mergeQueryKeys(challengeKey)

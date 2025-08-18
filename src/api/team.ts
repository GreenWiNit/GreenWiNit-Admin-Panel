import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from '@/constant/network'
import { stringify } from '@/lib/query-string'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export const teamApi = {
  // @MEMO v2 작업완료
  getTeams: async (params: { page?: number | undefined; size?: number | undefined }) => {
    return await fetch(`${API_URL}/admin/challenges/groups?${stringify(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<
          PaginatedResponse<{
            id: number
            /**
             * "T-20250109-143523-C8NQ"
             */
            groupCode: string
            groupName: string
            /**
             * "2025-08-09"
             */
            challengeDate: string
            maxParticipants: number
            currentParticipants: number
            recruitmentStatus: '모집중' | '완료'
            registrationDate: string
          }>
        >,
    )
  },
  getTeam: async (teamId: number) => {
    return await fetch(`${API_URL}/admin/challenges/groups/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<
          ApiResponse<{
            // 'T-20250109-143523-C8NQ'
            teamCode: string
            // 'google_4534'
            leaderMemberKey: string
            // 'google_3927, naver_9174'
            participantMemberKeys: string
            // '함께 플롯길 해요~
            teamTitle: string
            // '2025-06-08'
            date: string
            // '20:00'
            startTime: string
            // '21:00':
            endTime: string
            // '서울시 종로구 00강 입구'
            location: string
            // '1시간 동안 함께 플롯길 하는 코스입니다.'
            description: string
            // 'https://open.kakao.com/o/sAczYWth'
            openChatRoomLink: string
          }>
        >,
    )
  },
}

const teamKey = createQueryKeys('team', {
  teams: (params?: { page?: number | undefined; pageSize?: number | undefined }) =>
    [params] as const,
  team: (teamId?: number) => [teamId] as const,
})

export const teamQueryKeys = mergeQueryKeys(teamKey)

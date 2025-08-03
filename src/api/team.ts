import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from '@/constant/network'
import { stringify } from '@/lib/query-string'

export const teamApi = {
  getTeams: async (cursor?: number | null) => {
    return await fetch(`${API_URL}/admin/challenges/groups?${stringify({ cursor })}`, {
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
            nextCursor: number | null
            content: Array<{
              id: number
              /**
               * "T-20250109-143523-C8NQ"
               */
              teamCode: string
              teamTitle: string
              /**
               * "2025-08-09"
               */
              registrationDate: string
              maxParticipants: number
              currentParticipants: number
              recruitmentStatus: 'RECRUITING' | 'RECRUIT_COMPLETED'
            }>
          }
        }>,
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
        res.json() as Promise<{
          success: boolean
          message: string
          result: {
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
          }
        }>,
    )
  },
}

const teamKey = createQueryKeys('team', {
  teams: (cursor?: number | null) => [cursor ?? undefined] as const,
  team: (teamId?: number) => [teamId] as const,
})

export const teamQueryKeys = mergeQueryKeys(teamKey)

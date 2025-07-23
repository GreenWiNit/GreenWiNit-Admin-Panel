import { http, HttpResponse } from 'msw'
import { mockedChallengeStore, type IndividualChallenge } from '@/store/mockedChallengeStore'
import { API_URL } from '@/api/constant'

const challenges = mockedChallengeStore.getState().challenges
export const challengeHandlers = [
  http.get(`${API_URL}/admin/challenges/type/individual`, () => {
    return HttpResponse.json({
      challenges: challenges.filter(
        (challenge) => 'type' in challenge && challenge.type === 'individual',
      ),
    })
  }),
  http.get(
    `${API_URL}/admin/challenges/type/individual/:challengeId/participants`,
    ({ params }) => {
      const challengeId = Number(params['challengeId'])
      if (isNaN(challengeId) || challengeId === 0) {
        return new HttpResponse(null, { status: 500 })
      }
      const challenge = challenges.find((challenge) => challenge.id === challengeId)
      if (!challenge) {
        return new HttpResponse(null, { status: 404 })
      }
      if (!('type' in challenge)) {
        return new HttpResponse(null, { status: 500 })
      }
      if (challenge.type !== 'individual') {
        return new HttpResponse(null, { status: 500 })
      }
      const typeCastedChallenge = challenge as IndividualChallenge
      return HttpResponse.json({
        participants: typeCastedChallenge.participants,
      })
    },
  ),
]

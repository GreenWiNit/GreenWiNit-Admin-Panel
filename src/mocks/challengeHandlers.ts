import { http, HttpResponse } from 'msw'
import { mockedChallengeStore } from '@/store/mockedChallengeStore'
import { API_URL } from '@/api/constant'

const challenges = mockedChallengeStore.getState().challenges
export const challengeHandlers = [
  http.get(`${API_URL}/admin/challenges/type/individual`, () => {
    return HttpResponse.json({
      challenges,
    })
  }),
]

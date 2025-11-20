import { API_URL } from '@/constant/network'
import { throwResponseStatusThenChaining } from '@/lib/network'

export const itemApi = {
  createItem: async (params: {
    code: string
    name: string
    description: string
    thumbnailUrl: string
    price: number
  }) => {
    return await fetch(`${API_URL}/admin/point-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(throwResponseStatusThenChaining)
      .catch((error) => {
        throw error
      })
  },
}

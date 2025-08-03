import { API_URL } from '@/constant/network'
import { stringify } from '@/lib/query-string'
import { createQueryKeys } from '@lukemorales/query-key-factory'

export const postApi = {
  getPosts: async (page: number, size: number) => {
    return await fetch(`${API_URL}/admin/info?${stringify({ page, size })}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<{
          success: true
          message: string
          result: {
            content: PostsElement[]
            page: {
              totalElements: number
              totalPages: number
            }
          }
        }>,
    )
  },
}

export const postsQueryKeys = createQueryKeys('posts', {
  getPosts: (page: number, size: number) => [page, size] as const,
})

export interface PostsElement {
  id: string
  title: string
  infoCategoryName: string
  createdBy: string
  isDisplay: 'Y' | 'N'
  createdDate: string
}

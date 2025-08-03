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
  getPost: async (id: string) => {
    return await fetch(`${API_URL}/admin/info/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(
      (res) =>
        res.json() as Promise<{
          success: true
          message: string
          result: PostDetail
        }>,
    )
  },
  updatePost: async (
    id: string,
    data: {
      title: string
      content: string
      infoCategory: string
      imageUrl: string
      isDisplay: 'Y' | 'N'
    },
  ) => {
    return await fetch(`${API_URL}/admin/info/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },
  createPost: async (data: {
    title: string
    content: string
    infoCategory: string
    imageUrl: string
    isDisplay: 'Y' | 'N'
  }) => {
    return await fetch(`${API_URL}/admin/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },
}

export const postsQueryKeys = createQueryKeys('posts', {
  getPosts: (page: number, size: number) => [page, size] as const,
  getPost: (id: string) => [id] as const,
})

export interface PostsElement {
  id: string
  title: string
  // 'EVENT' | 'NOTICE' | 'NOTICE_EVENT'
  infoCategoryName: string
  createdBy: string
  isDisplay: 'Y' | 'N'
  createdDate: string
}

export interface PostDetail extends PostsElement {
  content: string
  imageurl: string
  lastModifiedBy: string
  modifiedDate: string
  createdDate: string
}

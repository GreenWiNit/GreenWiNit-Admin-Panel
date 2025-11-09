import { API_URL } from '@/constant/network'
import { downloadExcel, throwResponseStatusThenChaining } from '@/lib/network'
import { stringify } from '@/lib/query-string'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import { createQueryKeys } from '@lukemorales/query-key-factory'

export const postApi = {
  getPosts: async ({ page, size }: { page: number; size: number }) => {
    return await fetch(`${API_URL}/admin/info?${stringify({ page, size })}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json() as Promise<PaginatedResponse<PostsElement>>)
  },
  getPost: async (id: string) => {
    return await fetch(`${API_URL}/admin/info/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json() as Promise<ApiResponse<PostDetail>>)
  },
  updatePost: async (
    id: string,
    data: {
      title: string
      content: string
      infoCategory: string
      imageUrl: string[]
      isDisplay: 'Y' | 'N'
    },
  ) => {
    return await fetch(`${API_URL}/admin/info/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(throwResponseStatusThenChaining)
  },
  createPost: async (data: {
    title: string
    content: string
    infoCategory: string
    imageUrl: string[]
    isDisplay: 'Y' | 'N'
  }) => {
    return await fetch(`${API_URL}/admin/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(throwResponseStatusThenChaining)
  },
  downloadExcel: async () => {
    return await fetch(`${API_URL}/admin/info/excel`, {
      method: 'GET',
    }).then(downloadExcel)
  },
  deletePost: async (id: string) => {
    return await fetch(`${API_URL}/admin/info/${id}`, {
      method: 'DELETE',
    })
  },
  getCategories: async () => {
    return await fetch(`${API_URL}/admin/info/categories`, {
      method: 'GET',
    })
      .then((res) => res.json() as Promise<ApiResponse<PostCategory[]>>)
      .then((res) => {
        if (!res.success) {
          throw new Error(res.message)
        }
        return res
      })
      .then((res) => {
        return res.result.map((item) => ({
          ko: item.infoCategoryName,
          id: item.infoCategoryCode,
        }))
      })
  },
}

export const postsQueryKeys = createQueryKeys('posts', {
  getPosts: (pageParams: { page: number; pageSize: number }) => [pageParams] as const,
  getPost: (id: string) => [id] as const,
  getCategories: ['categories'],
})

export interface PostsElement {
  id: string
  title: string
  infoCategoryName: PostCategory['infoCategoryName']
  createdBy: string
  isDisplay: 'Y' | 'N'
  createdDate: string
}

export interface PostDetail extends PostsElement {
  content: string
  imageUrls: string[]
  lastModifiedBy: string
  modifiedDate: string
  createdDate: string
  infoCategoryCode: PostCategory['infoCategoryCode']
}

interface PostCategory {
  /**
   * '이벤트' | '콘텐츠' | '기타'
   */
  infoCategoryName: string
  /**
   * 'EVENT' | 'CONTENTS' | 'ETC'
   */
  infoCategoryCode: string
}

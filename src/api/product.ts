import { API_URL } from '@/constant/network'
import { stringify } from '@/lib/query-string'
import { createQueryKeys } from '@lukemorales/query-key-factory'

export const productApi = {
  getProducts: async (params: {
    status: 'exchangeable' | 'sold-out' | null
    keyword: string | null
    page: number | null
    size: number | null
  }) => {
    console.log('getProducts', params, API_URL)
    return await fetch(`${API_URL}/admin/point-products?${stringify(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      console.log('res', res)
      return res.json() as Promise<{
        success: true
        message: 'string'
        result: {
          totalElements: number
          totalPages: number
          currentPage: number
          pageSize: number
          hasNext: boolean
          content: ProductsResponseElement[]
        }
      }>
    })
  },
}

export interface ProductsResponseElement {
  /**
   * 'PRD-AA-001'
   */
  code: 'PRD-AA-001'
  name: string
  pointPrice: number
  stockQuantity: number
  /**
   * '교환가능'
   */
  sellingStatus: '교환가능' | '판매완료'
  /**
   * '전시'
   */
  displayStatus: '전시' | '미전시'
  /**
   * '2025-08-04T14:07:30.777Z'
   */
  createdDate: string
}

export const productsQueryKeys = createQueryKeys('products', {
  getProducts: ({
    page,
    size,
    status,
    keyword,
  }: {
    page: number | null
    size: number | null
    status: 'exchangeable' | 'sold-out' | null
    keyword: string | null
  }) => [{ page, size, status, keyword }] as const,
})

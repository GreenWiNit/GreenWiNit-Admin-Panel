import { API_URL } from '@/constant/network'
import { downloadExcel, throwResponseStatusThenChaining } from '@/lib/network'
import { stringify } from '@/lib/query-string'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { omit } from 'es-toolkit'

export const productApi = {
  getProducts: async (params: {
    status: SellingStatus | null
    keyword: string | null
    page: number | null
    size: number | null
  }) => {
    return await fetch(`${API_URL}/admin/point-products?${stringify(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
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
  getProduct: async (id: number) => {
    return await fetch(`${API_URL}/admin/point-products/${id}`, {
      method: 'GET',
    }).then((res) => {
      return res.json() as Promise<{
        success: true
        message: string
        result: ProductDetailResponse
      }>
    })
  },
  createProduct: async (params: {
    code: string
    name: string
    description: string
    thumbnailUrl: string
    price: number
    stock: number
  }) => {
    return await fetch(`${API_URL}/admin/point-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(throwResponseStatusThenChaining)
  },
  updateProduct: async (params: {
    id: number
    code: string
    name: string
    description: string
    thumbnailUrl: string
  }) => {
    return await fetch(`${API_URL}/admin/point-products/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(omit(params, ['id'])),
    }).then(throwResponseStatusThenChaining)
  },
  deleteProduct: async (id: number) => {
    return await fetch(`${API_URL}/admin/point-products/${id}`, {
      method: 'DELETE',
    }).then(throwResponseStatusThenChaining)
  },
  toggleDisplayStatus: async (id: number, status: string) => {
    return await fetch(
      `${API_URL}/admin/point-products/${id}/display-status/${status === '전시' ? 'show' : 'hide'}`,
      {
        method: 'PATCH',
      },
    ).then(throwResponseStatusThenChaining)
  },
  downloadProductsExcel: async (params: {
    keyword?: string | null
    status?: SellingStatus | null
  }) => {
    return await fetch(`${API_URL}/admin/point-products/excel?${stringify(params)}`, {
      method: 'GET',
    }).then(downloadExcel)
  },
  getProductsOrders: async ({ id, page, size }: { id: number; page?: number; size?: number }) => {
    return await fetch(
      `${API_URL}/admin/point-products/${id}/orders?${stringify({ page, size })}`,
      {
        method: 'GET',
      },
    ).then((res) => {
      return res.json() as Promise<{
        success: boolean
        message: string
        result: {
          totalElements: number
          totalPages: number
          currentPage: number
          pageSize: number
          hasNext: boolean
          content: ProductsOrdersResponseElement[]
        }
      }>
    })
  },
  getOrders: async ({
    page,
    size,
    status,
    keyword,
  }: {
    page?: number
    size?: number
    status?: DeliveryStatus
    keyword?: string
  }) => {
    return await fetch(
      `${API_URL}/admin/orders/point-products?${stringify({ page, size, status, keyword })}`,
      {
        method: 'GET',
      },
    ).then((res) => {
      return res.json() as Promise<{
        success: boolean
        message: string
        result?: {
          totalElements: number
          totalPages: number
          currentPage: number
          pageSize: number
          hasNext: true
          content: OrdersResponseElement[]
        }
      }>
    })
  },
  changeOrderStatus: async (orderId: number, status: DeliveryStatus) => {
    return await fetch(
      `${API_URL}/admin/orders/${orderId}/${status === '배송완료' ? 'complete' : status === '배송중' ? 'shipping' : ''}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
    ).then(throwResponseStatusThenChaining)
  },
}

export type SellingStatus = 'exchangeable' | 'sold-out'
export type SellingStatusKo = '교환가능' | '판매완료'

export interface ProductsResponseElement {
  // @TODO fix it when backend is ready
  // https://github.com/GreenWiNit/backend/issues/190
  id?: string
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

export interface ProductDetailResponse {
  // https://github.com/GreenWiNit/backend/issues/191
  pointProductCode?: string
  sellingStatus?: '교환가능' | '판매완료'
  displayStatus?: '전시' | '미전시'

  pointProductId: number
  pointProductName: string
  description: string
  thumbnailUrl: string
  pointPrice: number
  stockQuantity: number
}

export interface ProductsOrdersResponseElement {
  // https://github.com/GreenWiNit/backend/issues/192
  memberKey?: string
  memberEmail: string
  /**
   * '2025-08-04T17:07:34.243Z'
   */
  exchangedAt: string
  /**
   * '상품 신청' | '배송중' | '배송완료'
   */
  deliveryStatus: string
}

export interface OrdersResponseElement {
  // https://github.com/GreenWiNit/backend/issues/192
  memberKey?: string

  id: number
  exchangedAt: string
  memberEmail: string
  pointProductCode: string
  quantity: number
  totalPrice: number
  recipientName: string
  recipientPhoneNumber: string
  fullAddress: string
  status: DeliveryStatus
}

export type DeliveryStatus = '상품 신청' | '배송중' | '배송완료'

export const productsQueryKeys = createQueryKeys('products', {
  getProducts: ({
    page,
    size,
    status,
    keyword,
  }: {
    page: number | null
    size: number | null
    status: SellingStatus | null
    keyword: string | null
  }) => [{ page, size, status, keyword }] as const,
  getProduct: (id?: number | null) => [id ?? undefined] as const,
  orders: ['orders'] as const,
  getProductsOrders: ({ id, page, size }: { id?: number; page?: number; size?: number }) =>
    ['orders', { id, page, size }] as const,
})

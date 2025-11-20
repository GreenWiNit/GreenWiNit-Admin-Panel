import { API_URL } from '@/constant/network'
import { downloadExcel, throwResponseStatusThenChaining } from '@/lib/network'
import { stringify } from '@/lib/query-string'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import { createQueryKeys } from '@lukemorales/query-key-factory'
import { omit } from 'es-toolkit'

export const productApi = {
  getProducts: async (params: {
    status: SellingStatus | null
    keyword: string | null
    page: number
    size: number
  }) => {
    return await fetch(`${API_URL}/admin/point-products?${stringify(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(throwResponseStatusThenChaining)
      .then((res) => {
        return res.json() as Promise<PaginatedResponse<ProductsResponseElement>>
      })
  },
  getProduct: async (id: number) => {
    return await fetch(`${API_URL}/admin/point-products/${id}`, {
      method: 'GET',
    }).then((res) => {
      return res.json() as Promise<ApiResponse<ProductDetailResponse>>
    })
  },
  createProduct: async (params: {
    code: string
    name: string
    description: string
    thumbnailUrl: string
    price: number
    stock: number | null
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
      `${API_URL}/admin/point-products/${id}/${status === 'true' ? 'show' : 'hide'}`,
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
  getProductsOrders: async ({ id, page, size }: { id: number; page: number; size: number }) => {
    return await fetch(
      `${API_URL}/admin/orders/point-products/${id}?${stringify({ page, size })}`,
      {
        method: 'GET',
      },
    ).then((res) => {
      return res.json() as Promise<PaginatedResponse<ProductsOrdersResponseElement>>
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
    status?: DeliveryStatusKo | undefined
    keyword?: string
  }) => {
    return await fetch(
      `${API_URL}/admin/orders/point-products?${stringify({
        page,
        size,
        status: transferDeliveryStatusKoToDeliveryStatus(status),
        keyword,
      })}`,
      {
        method: 'GET',
      },
    ).then((res) => {
      return res.json() as Promise<PaginatedResponse<OrdersResponseElement>>
    })
  },
  changeOrderStatus: async (orderId: number, status: '배송중' | '배송 완료') => {
    return await fetch(
      `${API_URL}/admin/orders/${orderId}/${status === '배송중' ? 'shipping' : 'delivered'}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
    ).then(throwResponseStatusThenChaining)
  },
  downloadOrdersExcel: async (params: {
    keyword?: string | null
    status?: DeliveryStatusKo | null
    page?: number | null
    size?: number | null
  }) => {
    return await fetch(`${API_URL}/admin/orders/point-products/excel?${stringify(params)}`, {
      method: 'GET',
    })
      .then(throwResponseStatusThenChaining)
      .then(downloadExcel)
  },
}

export type SellingStatus = 'exchangeable' | 'sold-out'
export type SellingStatusKo = '교환가능' | '판매완료'

export interface ProductsResponseElement {
  id: string
  /**
   * 'PRD-AA-001'
   */
  code: string
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
  code?: string
  sellingStatus?: '교환가능' | '판매완료'
  display: boolean
  pointProductId: number
  pointProductName: string
  description: string
  thumbnailUrl: string
  pointPrice: number
  stockQuantity: number
}

export interface ProductsOrdersResponseElement {
  memberKey: string
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
  memberKey: string
  id: number
  exchangedAt: string
  memberEmail: string
  pointProductCode: string
  quantity: number
  totalPrice: number
  recipientName: string
  recipientPhoneNumber: string
  fullAddress: string
  display: DeliveryStatusKo
}

export type DeliveryStatusKo = '상품 신청' | '배송중' | '배송완료'

export const productsQueryKeys = createQueryKeys('products', {
  getProducts: ({
    page,
    pageSize,
    status,
    keyword,
  }: {
    page: number
    pageSize: number
    status: SellingStatus | null
    keyword: string | null
  }) => [{ page, pageSize, status, keyword }] as const,
  getProduct: (id?: number | null) => [id ?? undefined] as const,
  orders: ['orders'],
  getOrders: ({
    page,
    pageSize,
    status,
    keyword,
  }: {
    page: number
    pageSize: number
    status?: DeliveryStatusKo | undefined
    keyword?: string
  }) => ['orders', { page, pageSize, status, keyword }] as const,
  getProductsOrders: ({ id, page, pageSize }: { id: number; page: number; pageSize: number }) =>
    ['orders', { id, page, pageSize }] as const,
})

function transferDeliveryStatusKoToDeliveryStatus(status?: DeliveryStatusKo | undefined) {
  switch (status) {
    case '상품 신청':
      return 'pending-delivery'
    case '배송중':
      return 'shipping'
    case '배송완료':
      return 'delivered'
  }
  return ''
}

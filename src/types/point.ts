export type PointUserStatus = {
  id: string
  exchangedAt: number
  memberEmail: string
  pointProductCode: string
  quantity: string
  totalPrice: number
  recipientName: string
  recipientPhonNumber: number
  fullAddress: string
  status: string
}

export type PointHistory = {
  pointTrasactionId: string
  type: string
  description: string
  earnedAmout: number
  spentAmount: number
  balanceAfter: number
  transcationAt: string /* 백엔드 오타 수정 */
}

export type PointManageMemberList = {
  memberId: number
  memberKey: string
  memberEmail: string
  memberNickname: string
}

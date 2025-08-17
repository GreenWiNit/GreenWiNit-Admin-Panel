import type { PointManageMemberList } from './point'

export interface MembersPoint extends PointManageMemberList {
  memberPoint: number
}

export type UserExceptionId = Omit<MembersPoint, 'memberId'>

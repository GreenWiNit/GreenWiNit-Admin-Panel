import type { PointManageUserList } from './point'

export interface UsersPoint extends PointManageUserList {
  memberPoint: number
}

export type UserExceptionId = Omit<UsersPoint, 'memberId'>

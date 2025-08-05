import type { PointManageUserList } from './point'

export interface ActiveUser extends PointManageUserList {
  phoneNumber: string
  joinDate: Date
  role: string
  provider: string
}

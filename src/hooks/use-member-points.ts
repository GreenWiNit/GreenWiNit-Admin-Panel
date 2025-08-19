import { pointApi } from '@/api/point'
import { useQuery } from '@tanstack/react-query'

export const useMemberPoint = ({ memberId, page, size }: MemberPointProps) =>
  useQuery({
    queryKey: ['user-points', { memberId, page, size }],
    queryFn: () => pointApi.getMembersPoint(memberId, page, size),
  })

type MemberPointProps = {
  memberId: number
  page: number
  size: number
}

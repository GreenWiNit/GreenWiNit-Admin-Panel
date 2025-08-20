import { pointApi } from '@/api/point'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export const useMemberPoint = ({ memberId, page, size }: MemberPointProps) =>
  useQuery({
    queryKey: ['user-points', { memberId, page, size }],
    queryFn: () => pointApi.getMembersPoint(memberId, page, size),
    retry: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

type MemberPointProps = {
  memberId: number
  page: number
  size: number
}

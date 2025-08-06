import { useQuery } from '@tanstack/react-query'
import { memberApi, memberQueryKeys } from '@/api/member'

export const useActiveMembers = (page?: number, pageSize?: number) => {
  return useQuery({
    queryKey: memberQueryKeys.members.active(page, pageSize).queryKey,
    queryFn: () => memberApi.getActiveMembers(page, pageSize),
  })
}

export const useWithDrawn = (page?: number, pageSize?: number) => {
  return useQuery({
    queryKey: memberQueryKeys.members.withdrawn(page, pageSize).queryKey,
    queryFn: () => memberApi.getWithdrawn(page, pageSize),
  })
}

export const useActiveMembersExcel = () => {
  return useQuery({
    queryKey: memberQueryKeys.members.activeExcel.queryKey,
    queryFn: () => memberApi.getWithdrawn,
  })
}

export const useWithDrawnExcel = () => {
  return useQuery({
    queryKey: memberQueryKeys.members.withdrawnExcel.queryKey,
    queryFn: () => memberApi.getWithdrawn,
  })
}

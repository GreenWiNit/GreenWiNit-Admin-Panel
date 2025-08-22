import { useQuery } from '@tanstack/react-query'
import { memberApi, memberQueryKeys } from '@/api/member'
import useQueryDataGrid from './use-query-data-grid'

export const useActiveMembers = () => {
  return useQueryDataGrid({
    queryKeyWithPageParams: memberQueryKeys.members.active,
    queryFn: (ctx) => {
      const [, , , gridPaginationModel] = ctx.queryKey
      return memberApi.getActiveMembers({
        page: gridPaginationModel.page,
        size: gridPaginationModel.pageSize,
      })
    },
  })
}

export const useWithDrawn = () => {
  return useQueryDataGrid({
    queryKeyWithPageParams: memberQueryKeys.members.withdrawn,
    queryFn: (ctx) => {
      const [, , , gridPaginationModel] = ctx.queryKey
      return memberApi.getWithdrawn({
        page: gridPaginationModel.page,
        size: gridPaginationModel.pageSize,
      })
    },
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

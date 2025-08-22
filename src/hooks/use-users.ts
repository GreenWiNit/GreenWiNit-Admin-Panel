import { memberApi, memberQueryKeys } from '@/api/member'
import useQueryDataGrid from './use-query-data-grid'
import { gridPaginationModelToApiParams } from '@/lib/api'

export const useUsers = ({ keyword }: { keyword: string }) => {
  return useQueryDataGrid({
    queryKeyWithPageParams: (pageParams) =>
      memberQueryKeys.members.list({
        keyword: keyword,
        page: pageParams.page,
        pageSize: pageParams.pageSize,
      }),
    queryFn: (ctx) => {
      const [, , gridPaginationModel] = ctx.queryKey
      const pageParams = gridPaginationModelToApiParams(gridPaginationModel)
      return memberApi.getMembers({
        keyword,
        ...pageParams,
      })
    },
  })
}

import { pointApi, pointQueryKeys } from '@/api/point'
import useQueryDataGrid from './use-query-data-grid'
import { gridPaginationModelToApiParams } from '@/lib/api'

export const useMemberPoint = (memberId: number) =>
  useQueryDataGrid({
    queryKeyWithPageParams: (pageParams) =>
      pointQueryKeys.memberPoints({ ...pageParams, memberId }),
    queryFn: (ctx) => {
      const [, , gridPaginationModel] = ctx.queryKey
      return pointApi.getMembersPoint({
        id: memberId,
        ...gridPaginationModelToApiParams(gridPaginationModel),
      })
    },
    retry: false,
    refetchOnWindowFocus: false,
  })

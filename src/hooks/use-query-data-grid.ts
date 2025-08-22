import {
  keepPreviousData,
  useQuery,
  type QueryKey,
  type UndefinedInitialDataOptions,
} from '@tanstack/react-query'
import { useState } from 'react'
import { DEFAULT_PAGINATION_MODEL } from '@/constant/pagination'
import type { GridPaginationModel } from '@mui/x-data-grid'
import { DEFAULT_DATA_GRID_PROPS } from '@/constant/data-grid'

/**
 * useQuery에 페이지 파라미터를 추가해서 사용하는 훅입니다.
 */
function useQueryDataGrid<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(params: QueryOptionsRequiredQueryKey<TQueryFnData, TError, TData, TQueryKey>) {
  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>(DEFAULT_PAGINATION_MODEL)
  const query = useQuery({
    /**
     * 0page에서 1페이지로 클릭
     * -> queryKey가 바뀜 -> data: undefined, isLoading: true
     * -> <DataGrid rows={[]} rowCount={0} onPaginationModelChange={} />으로 처리됨
     * -> rows와 rowsCount가 바뀌면서 onPaginationModelChange가 트리거됨 -> 페이지네이션 모델의 page가 0으로 설정됨
     * -> API 페칭과 로딩은 끝났지만 실제로 페이지 이동이 실행되지 않음 (0p)
     *
     * keepPreviousData을 사용하면 쿼리키가 변경되어도 이전의 data를 유지함
     * 따라서 onPaginationModelChange가 트리거되지 않음
     * 다만 loading 표시를 하기위해서 아래쪽에서 isLoading의 값을 변경함 (isPlaceholderData)
     */
    placeholderData: keepPreviousData,
    ...params,
    queryKey:
      typeof params.queryKeyWithPageParams === 'function'
        ? params.queryKeyWithPageParams(paginationModel).queryKey
        : params.queryKeyWithPageParams,
  })

  query.isLoading = params.placeholderData
    ? query.isLoading
    : query.isPlaceholderData || query.isLoading
  return {
    query,
    paginationModel,
    setPaginationModel,
    defaultDataGridProps: {
      ...DEFAULT_DATA_GRID_PROPS,
      pageSizeOptions: [10, 15, 20],
      initialState: {
        pagination: {
          paginationModel: DEFAULT_PAGINATION_MODEL,
        },
      },
      paginationMode: 'server',
      loading: query.isLoading,
    } as const,
  }
}
/**
 * (custom) queryKeyWithPageParams: (pageParams: GridPaginationModel) => { queryKey: TQueryKey }
 * (tanstack original) queryKey: TQueryKey
 */
type QueryOptionsRequiredQueryKey<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = readonly unknown[],
> = Omit<UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'> & {
  queryKeyWithPageParams: TQueryKey | ((pageParams: GridPaginationModel) => { queryKey: TQueryKey })
}

export default useQueryDataGrid

import { useCallback, useRef, useState } from 'react'
import type { GridPaginationModel } from '@mui/x-data-grid'
import { DEFAULT_PAGINATION_MODEL } from '@/constant/pagination'

function usePaginationModelState() {
  const [paginationModel, _setPaginationModel] =
    useState<GridPaginationModel>(DEFAULT_PAGINATION_MODEL)
  // 중복 호출 방지를 위한 ref
  const isUpdatingRef = useRef(false)

  /**
   * onPaginationModelChange 안에서 state를 바꾸어서
   * 다시 렌더링 될 때 onPaginationModelChange가 한번 더 호출됨..
   * 왜일까..?
   */
  const setPaginationModel = useCallback((model: GridPaginationModel) => {
    // 중복 호출 방지
    if (isUpdatingRef.current) {
      return
    }
    isUpdatingRef.current = true
    _setPaginationModel(model)

    // 다음 렌더링 사이클에서 플래그 리셋
    setTimeout(() => {
      isUpdatingRef.current = false
    }, 1)
  }, [])

  return [paginationModel, setPaginationModel] as const
}

export default usePaginationModelState

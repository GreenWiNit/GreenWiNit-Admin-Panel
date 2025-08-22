import { DEFAULT_PAGINATION_MODEL } from '@/constant/pagination'
import type { GridPaginationModel } from '@mui/x-data-grid'

/**
 * GridPaginationModel에서 page는 0에서 시작합니다.
 * 그러나 지금 api에서는 1에서 시작하는 이슈가 있고,
 * 파라미터 이름도 다른 이슈가 있습니다.
 * 그런 처리를 위해 유틸리티 함수를 작성했습니다.
 * https://github.com/GreenWiNit/backend/issues/323
 */
export function gridPaginationModelToApiParams(model?: GridPaginationModel | null) {
  if (model == null) {
    return {
      page: DEFAULT_PAGINATION_MODEL.page,
      size: DEFAULT_PAGINATION_MODEL.pageSize,
    }
  }

  return {
    page: model.page + 1,
    size: model.pageSize,
  }
}

import type { GridPaginationModel } from '@mui/x-data-grid'

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE = 0

export const DEFAULT_PAGINATION_MODEL = {
  page: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
} satisfies GridPaginationModel

import type { DataGridProps } from '@mui/x-data-grid'

export const DEFAULT_DATA_GRID_PROPS: Omit<DataGridProps, 'columns' | 'rows'> = {
  sx: {
    '& .MuiDataGrid-row': {
      cursor: 'pointer',
    },
  },
  disableColumnFilter: true,
  disableColumnSorting: true,
}

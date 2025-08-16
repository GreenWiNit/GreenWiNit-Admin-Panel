export type GetListProps = {
  page: number
  size: number
}

export interface PointsListProps extends GetListProps {
  keyword: string
}

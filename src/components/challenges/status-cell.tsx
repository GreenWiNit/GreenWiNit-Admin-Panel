import type { CertificationStatus } from '@/api/challenge'
import type { GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shadcn/select'

function StatusCell<S extends SetChangeStatuses = SetChangeStatuses>(props: StatusCellProps<S>) {
  const [selected, setSelected] = useState(props.value)

  return (
    <div className="flex h-full w-full items-center justify-center">
      {props.value === '인증 요청' ? (
        <Select
          value={selected ?? '인증 요청'}
          onValueChange={(nextValue) => {
            setSelected(nextValue as CertificationStatus)
            props.row.setChangeStatuses((prev) => {
              if (nextValue === '인증 요청') {
                return prev.filter((p) => p.certificationId !== Number(props.id))
              }

              const hasPrev = prev.find((p) => p.certificationId === props.id)
              const nextItem = {
                certificationId: Number(props.id),
                status: nextValue as CertificationStatus,
              }

              if (hasPrev) {
                return prev.map((p) => {
                  if (p.certificationId === props.id) {
                    return nextItem
                  }
                  return p
                })
              }
              return [...prev, nextItem]
            })
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue>{selected}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="인증 요청">인증 요청</SelectItem>
            <SelectItem value="지급">지급</SelectItem>
            <SelectItem value="미지급">미지급</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Select value={props.value ?? ''} disabled>
          <SelectTrigger className="w-full">
            <SelectValue>{props.value}</SelectValue>
          </SelectTrigger>
        </Select>
      )}
    </div>
  )
}

type SetChangeStatuses = React.Dispatch<
  React.SetStateAction<
    {
      certificationId: number
      status: Omit<CertificationStatus, '인증 요청'>
    }[]
  >
>

type StatusCellProps<S extends SetChangeStatuses = SetChangeStatuses> = GridRenderCellParams<
  {
    setChangeStatuses: S
  },
  CertificationStatus,
  CertificationStatus,
  GridTreeNodeWithRender
>

export default StatusCell

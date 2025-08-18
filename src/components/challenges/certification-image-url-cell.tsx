import type { GridRenderCellParams, GridTreeNodeWithRender } from '@mui/x-data-grid'
import { Button } from '../shadcn/button'

type CertificationImageUrlProps = GridRenderCellParams<
  object,
  string,
  string,
  GridTreeNodeWithRender
>
function CertificationImageUrlCell(props: CertificationImageUrlProps) {
  return (
    <Button
      onClick={() => {
        if (props.value) {
          window.open(props.value, '_blank')
        }
      }}
    >
      {props.value?.split('/').pop()}
    </Button>
  )
}

export default CertificationImageUrlCell

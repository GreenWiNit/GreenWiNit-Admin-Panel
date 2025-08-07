// routes/points/$memberKey.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/points/$id/')({
  component: PointDetail,
})

function PointDetail() {
  const { id } = Route.useParams()

  return (
    <div>
      <h1>포인트 상세 - {id}</h1>
    </div>
  )
}

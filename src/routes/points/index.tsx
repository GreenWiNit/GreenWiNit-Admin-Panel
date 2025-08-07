import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { createFileRoute } from '@tanstack/react-router'

const PointsPage = () => {
  return (
    <PageContainer>
      <PageTitle>포인트 관리</PageTitle>
      <div>포인트 관리 페이지입니다.</div>
    </PageContainer>
  )
}

export const Route = createFileRoute('/points/')({
  component: PointsPage,
})

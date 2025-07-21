import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/challenges/type/team')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageContainer>
      <GlobalNavigation />
      <PageTitle>팀 챌린지 목록</PageTitle>
    </PageContainer>
  )
}

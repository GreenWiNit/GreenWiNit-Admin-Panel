import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/challenges/')({
  component: RouteComponent,
  loader(ctx) {
    console.log(ctx)

    throw redirect({
      to: '/challenges/type/individual',
    })
  },
})

function RouteComponent() {
  return (
    <PageContainer>
      <GlobalNavigation />
      <PageTitle>챌린지 관리</PageTitle>
    </PageContainer>
  )
}

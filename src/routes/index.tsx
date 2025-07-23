import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import { useUserStore } from '@/store/userStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

const loggedIn = useUserStore.getState().loggedIn
export const Route = createFileRoute('/')({
  component: Index,
  loader: () => {
    if (!loggedIn) {
      throw redirect({
        to: '/login',
      })
    }
  },
})

function Index() {
  return (
    <PageContainer>
      <GlobalNavigation />
    </PageContainer>
  )
}

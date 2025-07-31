import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import { userStore } from '@/store/userStore'
import { createFileRoute, redirect } from '@tanstack/react-router'

const loggedIn = userStore.getState().loggedIn
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

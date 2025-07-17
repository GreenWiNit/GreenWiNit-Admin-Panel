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
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  )
}

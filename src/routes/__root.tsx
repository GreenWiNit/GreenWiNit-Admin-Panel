import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import '../index.css'
import { Fragment } from 'react'

export const Route = createRootRoute({
  beforeLoad: async () => {
    if (import.meta.env.MODE === 'production') {
      return
    }

    const { worker } = await import('../mocks/browser')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
  },
  component: () => (
    <Fragment>
      <Outlet />
      <TanStackRouterDevtools />
    </Fragment>
  ),
})

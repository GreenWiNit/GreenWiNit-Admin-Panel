import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import '../index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import fetchIntercept, { type FetchInterceptorResponse } from 'fetch-intercept'
import { API_URL } from '@/api/constant'
import { userStore } from '@/store/userStore'

const queryClient = new QueryClient()

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
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <TanStackRouterDevtools />
    </QueryClientProvider>
  ),
})

fetchIntercept.register({
  request: function (url: string, config: RequestInit) {
    if (url.startsWith(API_URL)) {
      const nextConfig = {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${userStore.getState().loggedIn?.accessToken}`,
        },
      }

      return [
        url,
        {
          ...nextConfig,
        },
      ]
    }

    // Modify the url or config here
    return [url, config]
  },

  response: function (response: FetchInterceptorResponse) {
    if (response.url.startsWith(API_URL) && !response.ok) {
      if (response.status >= 400 && response.status < 500) {
        if (response.headers.get('content-type')?.includes('json')) {
          response.json().then((body) => {
            if (body.message === '접근이 거부되었습니다.') {
              userStore.getState().setAccessToken(null)
            }
          })
        }
      }
    }

    return response
  },
})

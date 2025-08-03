import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import '../index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import fetchIntercept, { type FetchInterceptorResponse } from 'fetch-intercept'
import { API_URL } from '@/constant/network'
import { userStore } from '@/store/userStore'
import { initHistoryAndLocation } from '@/lib/utils'

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
  notFoundComponent: () => {
    return <p>This setting page doesn&apos;t exist!</p>
  },
  errorComponent: ({ error }) => {
    return <div>Error: {error.message}</div>
  },
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
    const isApiUrl = API_URL.startsWith('/')
      ? new URL(response.url).pathname.startsWith(API_URL)
      : response.url.startsWith(API_URL)
    if (isApiUrl && !response.ok) {
      if (response.status >= 400 && response.status < 500) {
        if (response.headers.get('content-type')?.includes('json')) {
          response.json().then((body) => {
            if (body.message === '접근이 거부되었습니다.' || body.meesage.include('JWT 토큰')) {
              userStore.getState().setAccessToken(null)
              initHistoryAndLocation()
            }
          })
        }
      }
    }

    return response
  },
})

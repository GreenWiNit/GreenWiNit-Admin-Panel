import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '../index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import fetchIntercept, { type FetchInterceptorResponse } from 'fetch-intercept'
import { API_URL } from '@/constant/network'
import { userStore } from '@/store/userStore'
import { initHistoryAndLocation } from '@/lib/utils'
import { Toaster } from '@/components/shadcn/sonner'

const queryClient = new QueryClient()

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
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
          response
            .clone()
            .json()
            .then((body) => {
              if (body.message === '접근이 거부되었습니다.' || body.message.includes('JWT 토큰')) {
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

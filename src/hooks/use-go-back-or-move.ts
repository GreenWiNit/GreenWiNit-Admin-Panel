import { useCanGoBack, useRouter, type NavigateOptions } from '@tanstack/react-router'

export const useGoBackOrMove = (navigateOptions: NavigateOptions) => {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  return () => {
    if (canGoBack) {
      router.history.back()
    } else {
      router.navigate(navigateOptions)
    }
  }
}

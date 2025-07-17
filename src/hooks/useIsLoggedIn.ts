import { useUserStore } from '@/store/userStore'

const useIsLoggedIn = () => {
  const loggedIn = useUserStore((s) => s.loggedIn)
  return loggedIn != null
}

export default useIsLoggedIn

import { userStore } from '@/store/userStore'

const useIsLoggedIn = () => {
  const loggedIn = userStore((s) => s.loggedIn)
  return loggedIn != null
}

export default useIsLoggedIn

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface LoggedIn {
  accessToken: string
  loginId: string
  name: string
  role: string
}

interface UserStoreState {
  loggedIn: null | LoggedIn
  login: (user: LoggedIn) => void
}

export const useUserStore = create<UserStoreState>()(
  devtools(
    persist(
      (set) => ({
        loggedIn: null,
        login: (user: LoggedIn) => {
          set({ loggedIn: user })
        },
      }),
      {
        name: 'user',
      },
    ),
  ),
)

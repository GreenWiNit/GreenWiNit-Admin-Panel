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
  setAccessToken: (accessToken: string | null) => void
}

export const userStore = create<UserStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        loggedIn: null,
        login: (user: LoggedIn) => {
          set({ loggedIn: user })
        },
        setAccessToken: (accessToken: string | null) => {
          const loggedIn = get().loggedIn
          if (!loggedIn) return
          if (!accessToken) {
            set({ loggedIn: null })
            return
          }
          set({ loggedIn: { ...loggedIn, accessToken } })
        },
      }),
      {
        name: 'user',
      },
    ),
  ),
)

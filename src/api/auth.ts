import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import { API_URL } from './constant'
import type { LoggedIn } from '@/store/userStore'

export const authApi = {
  login: async ({ loginId, password }: { loginId: string; password: string }) => {
    return await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      body: JSON.stringify({ loginId, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json() as Promise<LoggedIn>)
  },
}

const authKey = createQueryKeys('auth')

export const authQueryKeys = mergeQueryKeys(authKey)

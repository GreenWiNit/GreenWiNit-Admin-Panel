import { challengeApi, CHALLENGES_TOP_KEY, type CertificationStatus } from '@/api/challenge'
import { showMessageIfExists } from '@/lib/error'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export function usePatchVerifyStatus() {
  const [changeStatuses, setChangeStatuses] = useState<
    {
      certificationId: number
      status: Omit<CertificationStatus, '인증 요청'>
    }[]
  >([])
  const queryClient = useQueryClient()

  return {
    ...useMutation({
      mutationFn: async function () {
        const statusToApprove = changeStatuses.filter((c) => c.status === '지급')
        const statusToReject = changeStatuses.filter((c) => c.status === '미지급')
        return challengeApi
          .patchVerifyStatus({
            certificationIds: statusToApprove.map((c) => c.certificationId),
            status: '지급',
          })
          .then(() => {
            return challengeApi.patchVerifyStatus({
              certificationIds: statusToReject.map((c) => c.certificationId),
              status: '미지급',
            })
          })
      },
      onSuccess: async () => {
        return queryClient.invalidateQueries({
          queryKey: [CHALLENGES_TOP_KEY],
        })
      },
      onError: (error) => {
        console.error(error)
        showMessageIfExists(error)
      },
    }),
    setChangeStatuses,
  }
}

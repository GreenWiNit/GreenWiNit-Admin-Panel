import { challengeApi, challengeQueryKeys } from '@/api/challenge'
import UpsertForm from '@/components/challenges/upsert-form'
import type { UpsertFormProps } from '@/components/challenges/upsert-form/type'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/shadcn/dialog'
import { Separator } from '@/components/shadcn/separator'
import { useGoBackOrMove } from '@/hooks/use-go-back-or-move'
import { showMessageIfExists } from '@/lib/error'
import { validateSearchChallengeType } from '@/lib/router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useState } from 'react'

export const Route = createFileRoute('/challenges/create')({
  component: CreateChallenge,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      challengeType: validateSearchChallengeType(search),
    }
  },
})

function CreateChallenge() {
  const searchParams = Route.useSearch()
  const movePage = useGoBackOrMove({ to: '/challenges' })
  const [showCreatingIsSuccess, setShowCreatingIsSuccess] = useState(false)
  const queryClient = useQueryClient()
  const challengeType = searchParams.challengeType

  const { mutate: createChallenge } = useMutation({
    mutationFn: (
      ...args:
        | Parameters<typeof challengeApi.createIndividualChallenge>
        | Parameters<typeof challengeApi.createTeamChallenge>
    ) => {
      if (challengeType === 'team') {
        return challengeApi.createTeamChallenge.apply(null, args)
      }

      return challengeApi.createIndividualChallenge.apply(null, args)
    },
    onSuccess: async (result) => {
      if (!result.success) {
        throw new Error(result.message)
      }

      await queryClient.invalidateQueries({
        queryKey: challengeQueryKeys.challenges.individual().queryKey,
      })
      await queryClient.invalidateQueries({
        queryKey: challengeQueryKeys.challenges.team().queryKey,
      })
      setShowCreatingIsSuccess(true)
    },
    onError: (error) => {
      console.error('onError', error)
      showMessageIfExists(error)
    },
  })

  const onSubmit: UpsertFormProps['onSubmit'] = (data) => {
    createChallenge({
      challengeName: data.title,
      challengePoint: data.point,
      beginDate: dayjs(data.period.start).format('YYYY-MM-DD'),
      endDate: dayjs(data.period.end).format('YYYY-MM-DD'),
      challengeImageUrl: data.imageUrl ?? '',
      challengeContent: data.content,
    })
  }

  return (
    <PageContainer className="items-start">
      <PageTitle>챌린지 생성 페이지</PageTitle>
      <Separator />
      <UpsertForm onSubmit={onSubmit} />
      <Dialog
        open={showCreatingIsSuccess}
        // 완료 버튼을 누르지않고, 키보드나 모달 바깥을 눌러 닫은 경우의 처리
        onOpenChange={(nextOpen) => {
          setShowCreatingIsSuccess(nextOpen)
          if (!nextOpen) {
            movePage()
          }
        }}
      >
        <DialogContent className="w-80">
          <DialogHeader>
            <DialogDescription>챌린지 생성이 완료되었습니다.</DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              setShowCreatingIsSuccess(false)
              movePage()
            }}
            className="end w-10 justify-self-end"
          >
            확인
          </Button>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}

import { challengeApi, challengeQueryKeys } from '@/api/challenge'
import UpsertForm from '@/components/challenges/upsert-form'
import type { UpsertFormProps } from '@/components/challenges/upsert-form/type'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/shadcn/dialog'
import { Separator } from '@/components/shadcn/separator'
import { useGoBackOrMove } from '@/hooks/use-go-back-or-move'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/challenges/create')({
  component: CreateChallenge,
})

function CreateChallenge() {
  const movePage = useGoBackOrMove({ to: '/challenges' })
  const [showCreatingIsSuccess, setShowCreatingIsSuccess] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: createChallenge } = useMutation({
    mutationFn: challengeApi.createChallenge,
    onSuccess: async (result) => {
      if (!result.success) {
        throw new Error(result.message)
      }

      await queryClient.invalidateQueries({
        queryKey: challengeQueryKeys.challenges.individual.queryKey,
      })
      await queryClient.invalidateQueries({
        queryKey: challengeQueryKeys.challenges.challenge(result.result).queryKey,
      })
      setShowCreatingIsSuccess(true)
    },
  })

  const onSubmit: UpsertFormProps['onSubmit'] = (data) => {
    console.debug('submit', data)
    createChallenge({
      challengeName: data.title,
      challengePoint: data.point,
      challengeType: data.type === 'individual' ? 'PERSONAL' : 'TEAM',
      beginDateTime: data.period.start?.toISOString() ?? '',
      endDateTime: data.period.end?.toISOString() ?? '',
      displayStatus: data.displayStatus,
      challengeImageUrl: data.imageUrl?.name ?? '',
      challengeContent: data.content,
      /**
       * @TODO check this value
       */
      maxGroupCount: 10,
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

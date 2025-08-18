import { challengeApi } from '@/api/challenge'
import UpsertForm from '@/components/challenges/upsert-form'
import type { FormState, UpsertFormProps } from '@/components/challenges/upsert-form/type'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog'
import { Separator } from '@/components/shadcn/separator'
import { useChallenge } from '@/hooks/use-challenge'
import { useGoBackOrMove } from '@/hooks/use-go-back-or-move'
import { invalidateChallenges } from '@/lib/query'
import { validateSearchChallengeType } from '@/lib/router'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/challenges/$id/update')({
  component: UpdateChallenge,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      challengeType: validateSearchChallengeType(search),
    }
  },
})

function UpdateChallenge() {
  const searchParams = Route.useSearch()
  const challengeType = searchParams.challengeType
  const { id } = Route.useParams()
  const { data, isLoading } = useChallenge({
    challengeId: Number(id),
    challengeType,
  })
  const movePage = useGoBackOrMove({ to: '/challenges' })
  const [showCreatingIsSuccess, setShowCreatingIsSuccess] = useState(false)

  const defaultValues = useMemo(() => {
    if (isLoading) {
      return undefined
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const challenge = data!.result
    if (!challenge) {
      throw new Error('challenge is null')
    }

    return {
      title: challenge.challengeName,
      period: {
        start: challenge.beginDate ? new Date(challenge.beginDate) : null,
        end: challenge.endDate ? new Date(challenge.endDate) : null,
      },
      point: challenge.challengePoint,
      content: challenge.challengeContent,
      imageUrl: challenge.challengeImage,
      displayStatus: challenge.displayStatus,
    } satisfies FormState
  }, [data, isLoading])

  const { mutate: updateChallenge } = useMutation({
    mutationFn: challengeApi.updateChallenge,
    onSuccess: async (result) => {
      if (!result.success) {
        throw new Error(result.message)
      }

      await invalidateChallenges()
      setShowCreatingIsSuccess(true)
    },
  })

  const onSubmit: UpsertFormProps['onSubmit'] = (data) => {
    if (!data.imageUrl) {
      toast.error('비정상적인 접근입니다. 이미지는 빈 값일 수 없습니다.')
      return
    }
    console.debug('submit', data)
    updateChallenge({
      challengeId: Number(id),
      challengeName: data.title,
      challengePoint: data.point,
      beginDate: dayjs(data.period.start).format('YYYY-MM-DD'),
      endDate: dayjs(data.period.end).format('YYYY-MM-DD'),
      challengeContent: data.content,
      challengeImageUrl: data.imageUrl,
      challengeType,
    })
  }

  return (
    <PageContainer className="items-start">
      <PageTitle>챌린지 수정 페이지</PageTitle>
      <Separator />
      <UpsertForm onSubmit={onSubmit} defaultValues={defaultValues} />
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
          <DialogTitle>
            <DialogHeader>
              <DialogDescription>챌린지 수정이 완료되었습니다.</DialogDescription>
            </DialogHeader>
          </DialogTitle>
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

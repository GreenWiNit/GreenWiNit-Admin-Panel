import UpsertForm from '@/components/challenges/upsert-form'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from '@/components/shadcn/dialog'
import { Separator } from '@/components/shadcn/separator'
import { useGoBackOrMove } from '@/hooks/use-go-back-or-move'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/challenges/create')({
  component: CreateChallenge,
})

function CreateChallenge() {
  const movePage = useGoBackOrMove({ to: '/challenges' })
  const [showCreatingIsSuccess, setShowCreatingIsSuccess] = useState(false)

  return (
    <PageContainer className="items-start">
      <PageTitle>챌린지 생성 페이지</PageTitle>
      <Separator />
      <UpsertForm
        onSuccess={() => {
          setShowCreatingIsSuccess(true)
        }}
      />
      <Dialog
        open={showCreatingIsSuccess}
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

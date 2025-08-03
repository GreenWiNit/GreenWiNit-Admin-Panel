import { challengeApi, challengeQueryKeys, type DisplayStatus } from '@/api/challenge'
import DatePickerRange from '@/components/date-picker-range'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { cn } from '@/lib/utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCanGoBack, useRouter } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { omit } from 'es-toolkit'
import { useId } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'

export const Route = createFileRoute('/challenges/create')({
  component: RouteComponent,
})

interface FormState {
  title: string
  type: 'individual' | 'team'
  period: {
    start: Date | null
    end: Date | null
  }
  point: number
  /**
   * 참여방법
   */
  content: string
  imageUrl: File | null
  displayStatus: DisplayStatus
}

function RouteComponent() {
  const form = useForm<FormState>({
    defaultValues: {
      period: {
        start: null,
        end: null,
      },
      displayStatus: 'VISIBLE',
    },
  })
  const radioInputIdVisible = useId()
  const radioInputIdHidden = useId()
  const queryClient = useQueryClient()
  const router = useRouter()
  const canGoBack = useCanGoBack()
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
      if (canGoBack) {
        router.history.back()
      } else {
        router.navigate({ to: '/challenges' })
      }
    },
  })

  const onSubmit: SubmitHandler<FormState> = (data) => {
    console.log(data)
    if (data.period.start === null || data.period.end === null) {
      form.setFocus('period')
      form.setError('period', { message: '진행기간을 선택해주세요.' })
      return
    }
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
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <table className="[&_td,th]:border [&_td,th]:p-2 [&_td,th]:text-left">
          <tbody>
            <tr>
              <th>챌린지 코드</th>
              <td>
                <Input contentEditable={false} disabled value="CH-P-20250602-001 (example)" />
              </td>
            </tr>
            <tr>
              <th>챌린지 제목 </th>
              <td>
                <Input {...form.register('title', { required: true })} />
              </td>
            </tr>
            <tr>
              <th>카테고리</th>
              <td>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <Select {...field} onValueChange={(value) => field.onChange(value)}>
                      <SelectTrigger
                        className={cn(
                          'w-[180px]',
                          form.formState.errors.type ? 'border-red-500' : null,
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">개인</SelectItem>
                        <SelectItem value="team">팀</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  rules={{
                    required: true,
                  }}
                />
              </td>
            </tr>
            <tr>
              <th>진행기간</th>
              <td>
                <div className="flex flex-row gap-2">
                  <Controller
                    control={form.control}
                    name="period"
                    render={({ field }) => (
                      <div
                        className={cn(
                          'flex flex-row items-center gap-2 border border-transparent',
                          form.formState.errors.period ? 'border-red-500' : null,
                        )}
                      >
                        <DatePickerRange
                          startDate={field.value.start}
                          endDate={field.value.end}
                          onChange={(startDate, endDate) => {
                            field.onChange({
                              start: startDate,
                              end: endDate,
                            })
                          }}
                        />
                      </div>
                    )}
                    rules={{
                      required: true,
                    }}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>포인트</th>
              <td>
                <Input {...form.register('point', { required: true })} />
              </td>
            </tr>
            <tr>
              <th>사용자 노출 이미지</th>
              <td>
                <Controller
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <Input
                      {...omit(field, ['value'])}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          field.onChange(file)
                        } else {
                          field.onChange(null)
                        }
                      }}
                    />
                  )}
                />
              </td>
            </tr>
            <tr>
              <th>참여방법</th>
              <td>
                <Input {...form.register('content')} />
              </td>
            </tr>
            <tr>
              <th>전시 여부</th>
              <td>
                <Controller
                  control={form.control}
                  name="displayStatus"
                  render={({ field }) => (
                    <RadioGroup {...field} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="VISIBLE"
                          id={radioInputIdVisible}
                          checked={field.value === 'VISIBLE'}
                        />
                        <Label htmlFor={radioInputIdVisible}>전시</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="HIDDEN"
                          id={radioInputIdHidden}
                          checked={field.value === 'HIDDEN'}
                        />
                        <Label htmlFor={radioInputIdHidden}>전시중지</Label>
                      </div>
                    </RadioGroup>
                  )}
                  rules={{
                    required: true,
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-end">
          <Button type="submit">저장</Button>
        </div>
      </form>
    </PageContainer>
  )
}

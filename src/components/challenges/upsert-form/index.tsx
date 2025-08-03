import DatePickerRange from '@/components/date-picker-range'
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
import { cn } from '@/lib/utils'
import { omit } from 'es-toolkit'
import { useEffect, useId } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import type { FormState, UpsertFormProps } from './type'

function UpsertForm({
  defaultValues = DEFAULT_VALUES,
  onSubmit: onSubmitFromProps,
}: UpsertFormProps) {
  const { register, control, formState, handleSubmit, setFocus, setError, reset } =
    useForm<FormState>({
      defaultValues,
    })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const radioInputIdVisible = useId()
  const radioInputIdHidden = useId()

  const onSubmit: SubmitHandler<FormState> = (data) => {
    console.log(data)
    if (data.period.start === null || data.period.end === null) {
      setFocus('period')
      setError('period', { message: '진행기간을 선택해주세요.' })
      return
    }

    onSubmitFromProps(data)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              <Input {...register('title', { required: true })} />
            </td>
          </tr>
          <tr>
            <th>카테고리</th>
            <td>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select {...field} onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger
                      className={cn('w-[180px]', formState.errors.type ? 'border-red-500' : null)}
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
                  control={control}
                  name="period"
                  render={({ field }) => (
                    <div
                      className={cn(
                        'flex flex-row items-center gap-2 border border-transparent',
                        formState.errors.period ? 'border-red-500' : null,
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
              <Input {...register('point', { required: true })} />
            </td>
          </tr>
          <tr>
            <th>사용자 노출 이미지</th>
            <td>
              <Controller
                control={control}
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
              <Input {...register('content')} />
            </td>
          </tr>
          <tr>
            <th>전시 여부</th>
            <td>
              <Controller
                control={control}
                name="displayStatus"
                render={({ field }) => (
                  <RadioGroup {...field} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="VISIBLE"
                        id={radioInputIdVisible}
                        checked={field.value === 'VISIBLE'}
                        onClick={() => {
                          field.onChange('VISIBLE')
                        }}
                      />
                      <Label htmlFor={radioInputIdVisible} className="cursor-pointer">
                        전시
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="HIDDEN"
                        id={radioInputIdHidden}
                        checked={field.value === 'HIDDEN'}
                        onClick={() => {
                          field.onChange('HIDDEN')
                        }}
                      />
                      <Label htmlFor={radioInputIdHidden} className="cursor-pointer">
                        전시중지
                      </Label>
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
  )
}

const DEFAULT_VALUES = {
  period: {
    start: null,
    end: null,
  },
  displayStatus: 'VISIBLE',
} satisfies Partial<FormState>

export default UpsertForm

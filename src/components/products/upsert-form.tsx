import { useForm, type SubmitHandler } from 'react-hook-form'
import { Input } from '../shadcn/input'
import InputImage from '../input-image'
import { Textarea } from '../shadcn/textarea'
import { Button } from '../shadcn/button'
import ErrorMessage from '../form/ErrorMessage'
import type { FormState, UpsertFormProps } from './type'
import { useEffect } from 'react'
import { useCanGoBack, useRouter } from '@tanstack/react-router'

const UpsertForm = ({
  defaultValues,
  onSubmit: onSubmitFromProps,
  renderBackButton,
}: UpsertFormProps) => {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const form = useForm<FormState>({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      thumbnailUrl: null,
      price: 0,
      stock: 0,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues, { keepDirty: false })
    }
  }, [defaultValues, form])

  const onSubmit: SubmitHandler<FormState> = async (data) => {
    const { thumbnailUrl, ...restFormData } = data

    if (!thumbnailUrl) {
      form.setError('thumbnailUrl', { message: '이미지를 선택해주세요.' })
      return
    }

    onSubmitFromProps({
      ...restFormData,
      thumbnailUrl,
    })
  }

  return (
    <form className="flex w-full max-w-160 flex-row gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <table className="w-full">
        <tbody className="[&_td,th]:border [&_td,th]:px-1 [&_td,th]:py-2 [&_th]:bg-gray-50 [&_th]:text-center">
          <tr>
            <th>상품코드</th>
            <td>
              <Input {...form.register('code')} placeholder="PRD-AA-000" />
            </td>
          </tr>
          <tr>
            <th>상품명</th>
            <td>
              <Input {...form.register('name')} />
            </td>
          </tr>
          <tr>
            <th>교환 포인트</th>
            <td>
              <Input {...form.register('price')} inputMode="numeric" />
            </td>
          </tr>
          <tr>
            <th>수량</th>
            <td>
              <Input {...form.register('stock')} inputMode="numeric" />
            </td>
          </tr>
          <tr>
            <th>이미지</th>
            <td>
              <InputImage
                {...form.register('thumbnailUrl')}
                purpose="product"
                value={form.watch('thumbnailUrl')}
                onChange={(src) => {
                  form.setValue('thumbnailUrl', src, { shouldDirty: true })
                }}
              />
              <ErrorMessage errors={form.formState.errors} name="thumbnailUrl" />
            </td>
          </tr>
          <tr>
            <th>상품 설명</th>
            <td>
              <Textarea {...form.register('description')} />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex flex-row gap-2 self-end">
        {renderBackButton && canGoBack && (
          <Button
            type="button"
            onClick={() => {
              // 왜 isDirty 값이 계속 false인지 잘 모르겠음
              if (form.formState.isDirty) {
                if (!confirm('정말 취소하시겠습니까?')) {
                  return
                }
              }
              router.history.back()
            }}
          >
            취소
          </Button>
        )}
        <Button type="submit">저장</Button>
      </div>
    </form>
  )
}

export default UpsertForm

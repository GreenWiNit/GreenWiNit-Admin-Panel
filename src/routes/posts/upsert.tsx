import { postApi, postsQueryKeys } from '@/api/post'
import DatePickerSingle from '@/components/date-picker-single'
import { RenderMessage } from '@/components/form/ErrorMessage'
import GlobalNavigation from '@/components/global-navigation'
import InputImage from '@/components/input-image'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import { Separator } from '@/components/shadcn/separator'
import { Textarea } from '@/components/shadcn/textarea'
import { ApiErrorHasErrors } from '@/lib/error'
import { ErrorMessage } from '@hookform/error-message'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import { useId } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/posts/upsert')({
  component: UpsertPost,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: search['id'] as string | undefined,
    }
  },
})

interface FormState {
  title: string
  content: string
  infoCategory: string
  imageUrl: string
  isDisplay: 'Y' | 'N'
}

function UpsertPost() {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const { id } = useSearch({ from: '/posts/upsert' })
  const { data } = useQuery({
    queryKey: postsQueryKeys.getPost(id ?? '').queryKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => postApi.getPost(id!),
    enabled: !!id,
  })
  const post = data?.result
  const { register, handleSubmit, control, setValue, setError, formState } = useForm<FormState>({
    defaultValues: {
      title: post?.title ?? '',
      content: post?.content ?? '',
      infoCategory: post?.infoCategoryName ?? 'EVENT',
      imageUrl: post?.imageurl ?? '',
      isDisplay: post?.isDisplay ?? 'Y',
    },
  })
  const { errors } = formState
  const radioInputIdVisible = useId()
  const radioInputIdHidden = useId()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const renderBackButton = Boolean(id)

  const { mutate: upsertPost } = useMutation({
    mutationFn: (data: FormState) => (id ? postApi.updatePost(id, data) : postApi.createPost(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.getPosts(0, 10).queryKey })
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.getPost(id ?? '').queryKey })
      navigate({ to: '/posts' })
    },
    onError: (error) => {
      console.error(error)
      if (error instanceof ApiErrorHasErrors) {
        error.errors.forEach((error) => {
          if (
            (
              [
                'title' satisfies keyof FormState,
                'content' satisfies keyof FormState,
                'imageUrl' satisfies keyof FormState,
                'infoCategory' satisfies keyof FormState,
                'isDisplay' satisfies keyof FormState,
              ] as string[]
            ).includes(error.fieldName)
          ) {
            setError(error.fieldName as keyof FormState, { message: error.message })
          } else {
            toast(`${error.fieldName}: ${error.message}`)
          }
        })
        console.log(error.errors)
      }
    },
  })
  const onSubmit: SubmitHandler<FormState> = (data) => {
    upsertPost(data)
  }

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex w-full flex-col gap-4">
        <PageTitle>정보공유 생성 및 수정</PageTitle>
        <Separator />
        <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          <table className="w-full border [&_td]:bg-gray-50 [&_td]:p-2 [&_td,th]:border [&_th]:p-2 [&_th]:text-left">
            <tbody>
              <tr>
                <th>정보공유명</th>
                <td>
                  <div className="flex flex-col gap-2">
                    <Input {...register('title', { required: true })} />
                    <ErrorMessage errors={errors} name="title" render={RenderMessage} />
                  </div>
                </td>
                <th>정보공유코드</th>
                <td>
                  <Input value={id} readOnly contentEditable={false} />
                </td>
              </tr>
              <tr>
                <th>카테고리</th>
                <td>
                  <div className="flex flex-col gap-2">
                    <Input {...register('infoCategory')} />
                    <ErrorMessage errors={errors} name="infoCategory" render={RenderMessage} />
                  </div>
                </td>
                <th>등록 날짜</th>
                <td>
                  {post == null ? null : (
                    <DatePickerSingle
                      value={post?.createdDate ?? ''}
                      onChange={(date) => {
                        console.log(date)
                      }}
                      readOnly
                    />
                  )}
                </td>
              </tr>
              <tr>
                <th>이미지</th>
                <td colSpan={3}>
                  <div className="flex flex-col gap-2">
                    <InputImage
                      {...register('imageUrl')}
                      purpose="info"
                      value={post?.imageurl ?? null}
                      onChange={(src) => {
                        setValue('imageUrl', src ?? '')
                      }}
                    />
                    <ErrorMessage errors={errors} name="imageUrl" render={RenderMessage} />
                  </div>
                </td>
              </tr>
              <tr>
                <th>설명</th>
                <td colSpan={3}>
                  <div className="flex flex-col gap-2">
                    <Textarea {...register('content', { required: true })} />
                    <ErrorMessage errors={errors} name="content" render={RenderMessage} />
                  </div>
                </td>
              </tr>
              <tr>
                <th>전시여부</th>
                <td colSpan={3}>
                  <Controller
                    control={control}
                    name="isDisplay"
                    render={({ field }) => (
                      <div className="flex flex-col gap-2">
                        <RadioGroup {...field} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              id={radioInputIdVisible}
                              value="Y"
                              checked={field.value === 'Y'}
                              onClick={() => {
                                console.log('Y')
                                field.onChange('Y')
                              }}
                            />
                            <Label htmlFor={radioInputIdVisible} className="cursor-pointer">
                              전시
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="N"
                              checked={field.value === 'N'}
                              onClick={() => {
                                console.log('N3')
                                field.onChange('N')
                              }}
                              id={radioInputIdHidden}
                            />
                            <Label htmlFor={radioInputIdHidden} className="cursor-pointer">
                              미전시
                            </Label>
                          </div>
                        </RadioGroup>
                        <ErrorMessage errors={errors} name="isDisplay" render={RenderMessage} />
                      </div>
                    )}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end gap-2">
            {renderBackButton && canGoBack && (
              <Button
                type="button"
                onClick={() => {
                  // 왜 isDirty 값이 계속 false인지 잘 모르겠음
                  if (formState.isDirty) {
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
      </div>
    </PageContainer>
  )
}

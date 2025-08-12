import { postApi, postsQueryKeys } from '@/api/post'
import DatePickerSingle from '@/components/date-picker-single'
import GlobalNavigation from '@/components/global-navigation'
import InputImage from '@/components/input-image'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn/radio-group'
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { Textarea } from '@/components/shadcn/textarea'
import usePostCategories from '@/hooks/use-post-categoris'
import { ApiErrorHasErrors } from '@/lib/error'
import ErrorMessage from '@/components/form/ErrorMessage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
  useSearch,
} from '@tanstack/react-router'
import { omit } from 'es-toolkit'
import { useEffect, useId } from 'react'
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
  categoryId: string | null
  imageUrl: string
  isDisplay: 'Y' | 'N'
}

function UpsertPost() {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const { id } = useSearch({ from: '/posts/upsert' })
  const { data: categories } = usePostCategories()
  const { data } = useQuery({
    queryKey: postsQueryKeys.getPost(id ?? '').queryKey,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    queryFn: () => postApi.getPost(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
  const post = data?.result
  const { register, handleSubmit, control, setValue, setError, formState, reset, watch } =
    useForm<FormState>({
      defaultValues: {
        title: post?.title ?? '',
        content: post?.content ?? '',
        categoryId: post?.infoCategoryCode ?? categories?.[0]?.id ?? null,
        imageUrl: post?.imageurl ?? '',
        isDisplay: post?.isDisplay ?? 'Y',
      },
    })
  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        content: post.content,
        categoryId: post.infoCategoryCode,
        imageUrl: post.imageurl,
        isDisplay: post.isDisplay,
      })
    }
  }, [post, reset])
  const { errors } = formState
  const radioInputIdVisible = useId()
  const radioInputIdHidden = useId()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const renderBackButton = Boolean(id)

  const { mutate: upsertPost } = useMutation({
    mutationFn: (
      data: Omit<FormState, 'categoryId'> & { categoryId: NonNullable<FormState['categoryId']> },
    ) => {
      const infoCategory = data.categoryId
      const payload = {
        ...omit(data, ['categoryId']),
        infoCategory,
      }
      return id ? postApi.updatePost(id, payload) : postApi.createPost(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKeys.getPosts(0, 10).queryKey })
      if (id) {
        queryClient.invalidateQueries({ queryKey: postsQueryKeys.getPost(id).queryKey })
      }
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
                'categoryId' satisfies keyof FormState,
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
    if (data.categoryId == null) {
      console.error('알 수 없는 에러가 발생했습니다. categoryId가 비었습니다.')
      return
    }
    upsertPost({
      ...data,
      categoryId: data.categoryId,
    })
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
                    <ErrorMessage errors={errors} name="title" />
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
                    <Controller
                      control={control}
                      name="categoryId"
                      render={({ field }) => (
                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리를 선택해주세요." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.ko}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      rules={{ required: '카테고리를 선택해주세요.' }}
                    />
                    <ErrorMessage errors={errors} name="categoryId" />
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
                      value={watch('imageUrl') ?? null}
                      onChange={(src) => {
                        setValue('imageUrl', src ?? '')
                      }}
                    />
                    <ErrorMessage errors={errors} name="imageUrl" />
                  </div>
                </td>
              </tr>
              <tr>
                <th>설명</th>
                <td colSpan={3}>
                  <div className="flex flex-col gap-2">
                    <Textarea {...register('content', { required: true })} />
                    <ErrorMessage errors={errors} name="content" />
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
                        <ErrorMessage errors={errors} name="isDisplay" />
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

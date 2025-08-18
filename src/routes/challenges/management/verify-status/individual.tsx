import { challengeApi, challengeQueryKeys, type CertificationStatus } from '@/api/challenge'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { DEFAULT_PAGINATION_MODEL } from '@/constant/pagination'
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
  type GridTreeNodeWithRender,
} from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment, useState } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'

export const Route = createFileRoute('/challenges/management/verify-status/individual')({
  component: RouteComponent,
})

function RouteComponent() {
  const searchFormInputing = useForm({
    defaultValues: DEFAULT_SEARCH_FORM,
  })
  /** searchFormInputing - (submit) -> update searchForm */
  const [searchRequestParams, setSearchRequestParams] = useState<SearchForm>(DEFAULT_SEARCH_FORM)
  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>(DEFAULT_PAGINATION_MODEL)

  const { data: challengesWithVerifyStatus } = useQuery({
    queryKey: challengeQueryKeys.challenges.individualWithVerifyStatus({
      ...searchRequestParams,
      ...paginationModel,
    }).queryKey,
    queryFn: (ctx) => {
      const [, , , , apiParamsFromQueryKey] = ctx.queryKey

      return challengeApi.getChallengesWithVerifyStatus({
        ...apiParamsFromQueryKey,
        challengeType: 'individual',
      })
    },
  })

  const submitHandler: SubmitHandler<SearchForm> = (data) => {
    console.log('data', data)
    setSearchRequestParams(data)
  }

  return (
    <PageContainer>
      <div className="flex w-full flex-col gap-4">
        <PageTitle className="self-start">개인 챌린지 인증확인</PageTitle>
        <Separator />
        <form
          className="flex flex-row gap-4"
          onSubmit={searchFormInputing.handleSubmit(submitHandler)}
        >
          <table className="table-auto border-collapse border border-amber-500">
            <tbody className="[&_td,th]:border [&_td,th]:px-1 [&_td,th]:py-2 [&_td,th]:text-sm [&_th]:text-center">
              <tr>
                <th>개인 챌린지 제목</th>
                <td>
                  <Input {...searchFormInputing.register('challengeName')} />
                </td>
              </tr>
              <tr>
                <th>참여자</th>
                <td>
                  <Input {...searchFormInputing.register('memberKey')} />
                </td>
              </tr>
              <tr>
                <th>포인트</th>
                <td>
                  <div className="flex flex-row justify-center gap-2">
                    <Controller
                      control={searchFormInputing.control}
                      name="statuses"
                      render={(renderProps) => {
                        const { field } = renderProps
                        const statuses = field.value

                        return (
                          <Fragment>
                            <Label>
                              <Checkbox
                                checked={statuses.includes('인증 요청')}
                                onCheckedChange={(checked) => {
                                  field.onChange(
                                    checked
                                      ? ['인증 요청']
                                      : statuses.filter((status) => status !== '인증 요청'),
                                  )
                                }}
                              />
                              인증요청
                            </Label>
                            <Label>
                              <Checkbox
                                checked={statuses.includes('지급')}
                                onCheckedChange={(checked) => {
                                  field.onChange(
                                    checked
                                      ? ['지급']
                                      : statuses.filter((status) => status !== '지급'),
                                  )
                                }}
                              />
                              지급
                            </Label>
                            <Label>
                              <Checkbox
                                checked={statuses.includes('미지급')}
                                onCheckedChange={(checked) => {
                                  field.onChange(
                                    checked
                                      ? ['미지급']
                                      : statuses.filter((status) => status !== '미지급'),
                                  )
                                }}
                              />
                              미지급
                            </Label>
                          </Fragment>
                        )
                      }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Button className="self-end" type="submit">
            검색
          </Button>
        </form>
        <div className="flex w-full">
          <DataGrid
            rows={
              challengesWithVerifyStatus?.result?.content?.map((c) => {
                return {
                  ...c,
                  challengeName: c.challenge.name,
                  challengeCode: c.challenge.code,
                  memberKey: c.member.key,
                  certifiedDate: c.certifiedDate,
                  certificationImageUrl: c.imageUrl,
                  certificationReview: c.review,
                  status: c.status,
                }
              }) ?? []
            }
            initialState={{
              pagination: {
                paginationModel: DEFAULT_PAGINATION_MODEL,
              },
            }}
            onPaginationModelChange={setPaginationModel}
            paginationModel={paginationModel}
            rowCount={challengesWithVerifyStatus?.result?.totalElements ?? 0}
            paginationMode="server"
            columns={columns}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </PageContainer>
  )
}

interface SearchForm {
  challengeName: string
  memberKey: string
  statuses: CertificationStatus[]
}
const DEFAULT_SEARCH_FORM: SearchForm = {
  challengeName: '',
  memberKey: '',
  statuses: [],
}

const columns: GridColDef<{
  challengeName: string
  challengeCode: string
  memberKey: string
  certifiedDate: string
  certificationImageUrl: string
  certificationReview: string
  status: CertificationStatus
}>[] = [
  {
    field: 'challengeName',
    headerName: '챌린지 제목',
    width: 300,
  },
  { field: 'challengeCode', headerName: '챌린지 코드', width: 200 },
  {
    field: 'memberKey',
    headerName: 'MemberKey',
    width: 300,
  },
  {
    field: 'certifiedDate',
    headerName: '인증하기 날짜',
    width: 150,
  },
  {
    field: 'certificationImageUrl',
    headerName: '인증 이미지',
    width: 150,
    renderCell(params) {
      return (
        <Button
          onClick={() => {
            window.open(params.value, '_blank')
          }}
        >
          {params.value.split('/').pop()}
        </Button>
      )
    },
  },
  {
    field: 'certificationReview',
    headerName: '간단한 후기',
    width: 150,
  },
  {
    field: 'status',
    headerName: '포인트',
    width: 200,
    renderCell: StatusCell,
  },
]

function StatusCell(
  props: GridRenderCellParams<
    {
      challengeName: string
      challengeCode: string
      memberKey: string
      certifiedDate: string
      certificationImageUrl: string
      certificationReview: string
      status: CertificationStatus
    },
    CertificationStatus,
    CertificationStatus,
    GridTreeNodeWithRender
  >,
) {
  const [selected, setSelected] = useState(props.value)

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Select
        value={selected ?? '인증 요청'}
        onValueChange={(value) => {
          setSelected(value as CertificationStatus)
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue>{selected}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="인증 요청">인증 요청</SelectItem>
          <SelectItem value="지급">지급</SelectItem>
          <SelectItem value="미지급">미지급</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

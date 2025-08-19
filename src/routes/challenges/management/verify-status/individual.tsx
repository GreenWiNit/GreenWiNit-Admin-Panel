import { challengeApi, challengeQueryKeys, type CertificationStatus } from '@/api/challenge'
import CertificationImageUrlCell from '@/components/challenges/certification-image-url-cell'
import StatusCell from '@/components/challenges/status-cell'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Separator } from '@/components/shadcn/separator'
import { DEFAULT_PAGINATION_MODEL } from '@/constant/pagination'
import usePaginationModelState from '@/hooks/use-pagination-model-state'
import { usePatchVerifyStatus } from '@/hooks/use-patch-verify-status'
import { gridPaginationModelToApiParams } from '@/lib/api'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
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
  const [paginationModel, setPaginationModel] = usePaginationModelState()

  const { data: challengesWithVerifyStatus } = useQuery({
    queryKey: challengeQueryKeys.challenges.individualWithVerifyStatus({
      ...searchRequestParams,
      ...gridPaginationModelToApiParams(paginationModel),
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

  const { mutate: patchVerifyStatus, setChangeStatuses } = usePatchVerifyStatus()

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
                  setChangeStatuses,
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
      <Button
        className="self-end"
        onClick={() => {
          patchVerifyStatus()
        }}
      >
        저장
      </Button>
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
  setChangeStatuses: React.Dispatch<
    React.SetStateAction<
      {
        certificationId: number
        status: Omit<CertificationStatus, '\uC778\uC99D \uC694\uCCAD'>
      }[]
    >
  >
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
    renderCell: CertificationImageUrlCell,
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

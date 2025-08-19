import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowParams,
} from '@mui/x-data-grid'
import { Separator } from '@radix-ui/react-separator'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useUsers } from '@/hooks/use-users'
import GlobalNavigation from '@/components/global-navigation'
import { memberStore } from '@/store/memberStore'
import type { MembersPoint } from '@/types/user'
import type { PointManageMemberList } from '@/types/point'

interface SearchForm {
  keyword: string
  page: number
  size: number
}

const DEFAULT_SEARCH_FORM: SearchForm = {
  keyword: '',
  page: 0,
  size: 10,
}

function PointsPage() {
  const router = useRouter()
  const setSelectedMember = memberStore((state) => state.setSelectedMember)

  const searchFormBeforeSubmitting = useForm<SearchForm>({
    defaultValues: DEFAULT_SEARCH_FORM,
  })

  const [searchFormToSubmit, setSearchFormToSubmit] = useState<SearchForm>(DEFAULT_SEARCH_FORM)

  const { data: userManageData } = useUsers({
    keyword: searchFormToSubmit.keyword,
    page: searchFormToSubmit.page,
    size: searchFormToSubmit.size,
  })

  if (userManageData === null) return

  const handleRowClick = (params: GridRowParams<MembersPoint>) => {
    const memberData = params.row
    setSelectedMember(memberData)
    router.navigate({ to: `/points/${memberData.memberId}` })
  }

  const onSubmit: SubmitHandler<SearchForm> = async (data) => {
    setSearchFormToSubmit({ ...data, page: 0 })
  }

  const handlePaginationChange = (model: GridPaginationModel) => {
    const newFormData = {
      ...searchFormToSubmit,
      page: model.page,
      size: model.pageSize,
    }
    setSearchFormToSubmit(newFormData)
    searchFormBeforeSubmitting.setValue('page', model.page)
    searchFormBeforeSubmitting.setValue('size', model.pageSize)
  }

  const rows =
    userManageData?.result?.content.map(
      (user: MembersPoint): MembersPoint => ({
        memberId: user.memberId,
        memberKey: user.memberKey,
        memberEmail: user.memberEmail,
        memberNickname: user.memberNickname,
        memberPoint: user.memberPoint,
      }),
    ) ?? []

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="mx-8 flex w-full flex-col gap-2">
        <PageTitle>포인트 관리</PageTitle>
        <Separator />
        <form onSubmit={searchFormBeforeSubmitting.handleSubmit(onSubmit)}>
          <div className="flex flex-row items-center gap-2 border-2 py-2">
            <div className="shrink-0 border-r-2 px-2 py-0 font-bold">검색어</div>
            <Input
              {...searchFormBeforeSubmitting.register('keyword')}
              placeholder="사용자 ID 또는 닉네임 검색"
              className="flex flex-1 border-0 focus:outline-0"
            />
            <Button type="submit" className="mx-2 px-8 py-2">
              검색
            </Button>
          </div>
        </form>

        <div className="scrollbar-hide mt-2 h-160 w-full">
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.memberKey}
            paginationModel={{
              page: searchFormBeforeSubmitting.watch('page'),
              pageSize: searchFormBeforeSubmitting.watch('size'),
            }}
            onRowClick={handleRowClick}
            onPaginationModelChange={handlePaginationChange}
          />
        </div>
      </div>
    </PageContainer>
  )
}

export const Route = createFileRoute('/products/')({
  component: PointsPage,
})

const columns: GridColDef<PointManageMemberList>[] = [
  { field: 'memberKey', headerName: 'MemberKey', flex: 1 },
  { field: 'memberEmail', headerName: '사용자 이메일', flex: 2 },
  { field: 'memberNickname', headerName: '닉네임', flex: 2 },
  { field: 'memberPoint', headerName: '남은 포인트', flex: 2 },
]

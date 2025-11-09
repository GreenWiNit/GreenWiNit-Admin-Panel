import GlobalNavigation from '@/components/global-navigation'
import PageContainer from '@/components/page-container'
import PageTitle from '@/components/page-title'
import { useGetPost } from '@/hooks/use-post'
import { Separator } from '@radix-ui/react-select'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({ from: '/posts/$id/' })
  const { data: post } = useGetPost(id)
  const postData = post?.result

  return (
    <PageContainer className="flex-row">
      <GlobalNavigation />
      <div className="flex flex-col gap-4">
        <PageTitle>정보공유 상세</PageTitle>
        <Separator />
        <table className="border[&_td]:bg-gray-50 w-full [&_td]:p-2 [&_td,th]:border [&_th]:p-2 [&_th]:text-left">
          <tbody>
            <tr>
              <th>정보공유명</th>
              <td>{postData?.title}</td>
              <th>정보공유코드</th>
              <td>{postData?.id}</td>
            </tr>
            <tr>
              <th>카테고리</th>
              <td>{postData?.infoCategoryName}</td>
              <th>등록날짜</th>
              <td>{postData?.createdBy}</td>
              <th>전시여부</th>
              <td>{postData?.isDisplay}</td>
            </tr>
            <tr>
              <th>이미지</th>
              <td className="w-full">
                {postData?.imageUrls.map((url, index) => (
                  <div className="flex flex-col gap-2" key={index}>
                    <img className="h-48 w-48 rounded-lg border object-cover" src={url} />
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <th>설명</th>
              <td>
                <div>{postData?.content}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageContainer>
  )
}

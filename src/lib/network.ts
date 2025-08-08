import { ApiErrorHasErrors } from './error'

export async function throwResponseStatusThenChaining(response: Response) {
  const body = await response.clone().json()
  if (response.ok) {
    if ('success' in body) {
      // success가 있는데 falsy하면 throw하기 위해 아래쪽으로 흐름을 가짐
      if (body.success) {
        return response
      }
      // success가 없는 경우 그대로 반환
    } else {
      return response
    }
  }

  return response
    .clone()
    .json()
    .then((body) => {
      if ('errors' in body) {
        throw new ApiErrorHasErrors(body.message, body.errors)
      }
      throw new Error(body.message || `HTTP ${response.status}: ${response.statusText}`)
    })
}

export async function downloadExcel(response: Response) {
  const header = response.headers.get('Content-Disposition')
  if (!header) {
    throw new Error('Content-Disposition header not found')
  }
  const parts = header?.split(';')
  const filename = parts?.[1]?.split('=')?.[1]?.replaceAll('"', '') ?? ''

  const blob = await response.blob()
  if (blob != null) {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
}

/**
 * foo.example.com -> api.example.com
 */
const getApiBaseUrl = () => {
  const { hostname, protocol, port } = window.location

  if (hostname.includes('localhost')) {
    return `${protocol}//${hostname}:${port}/api`
  }

  // 맨 앞 서브도메인만 'api'로 바꿈 (원본 배열 수정 없이)
  const parts = hostname.split('.')
  const apiHost = ['api', ...parts.slice(1)].join('.')

  return `${protocol}//${apiHost}:${port}`
}

export const API_URL = new URL(getApiBaseUrl()).href

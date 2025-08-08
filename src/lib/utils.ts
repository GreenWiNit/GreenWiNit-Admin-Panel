import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initHistoryAndLocation(paramTo: string = '/') {
  // 브라우저의 히스토리 스택을 완전히 클리어하고 싶지만,
  // 해당 방법을 찾지 못했음 (아마 보안상의 이유로 그런 방법이 없는 것으로 추측)
  // 스택에 루트 두개 넣어서 뒤로가기 버튼 눌러도 루트로 이동하게끔 처리함
  if (window.location.pathname !== paramTo) {
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }
  const to =
    paramTo.startsWith('/') && import.meta.env.PROD
      ? `/quux_hidden_app.html.html${paramTo}`
      : paramTo
  window.history.pushState(null, '', to)
  window.history.pushState(null, '', to)
}

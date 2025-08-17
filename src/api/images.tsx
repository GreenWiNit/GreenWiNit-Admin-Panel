import { API_URL } from '@/constant/network'
import type { ApiResponse } from '@/types/api'

export const imagesApi = {
  uploadImage: async (
    purpose: 'challenge' | 'challenge-cert' | 'info' | 'product' | 'profile',
    file: File,
  ) => {
    const formData = new FormData()
    formData.append('imageFile', file)
    const response = await fetch(`${API_URL}/images?purpose=${purpose}`, {
      method: 'POST',
      body: formData,
    })
    return response.json() as Promise<
      ApiResponse<
        /**
         * ex) 'https://static.greenwinit.store/images/profile/8d/20250727/d93917a6_1753638663985.png'
         */
        string,
        '이미지 업로드에 성공했습니다.'
      >
    >
  },
}

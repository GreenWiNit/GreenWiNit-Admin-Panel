import type { PointManageMemberList } from '@/types/point'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface MemberStoreState {
  selectedMember: MemberList | null
  setSelectedMember: (member: PointManageMemberList) => void
  getSelectedMemberInfo: () => MemberList | null
}

export const memberStore = create<MemberStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        selectedMember: null,
        setSelectedMember: (member: PointManageMemberList) => set({ selectedMember: member }),
        getSelectedMemberInfo: () => {
          const { selectedMember } = get()
          if (!selectedMember) return null

          return {
            memberEmail: selectedMember.memberEmail,
            memberNickname: selectedMember.memberNickname,
            memberKey: selectedMember.memberKey,
          }
        },
      }),
      {
        name: 'member',
      },
    ),
  ),
)

export type MemberList = Omit<PointManageMemberList, 'memberId'>

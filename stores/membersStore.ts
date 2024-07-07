import { User } from '@/stores/userStore';
import { create } from 'zustand';

interface UserState {
  members: User[];
  setMembers: (members: User[]) => void;
}

export const useMembersStore = create<UserState>((set) => ({
  members: [],
  setMembers: (members) => set({ members }),
}));

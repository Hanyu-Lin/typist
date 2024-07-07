import { nanoid } from 'nanoid';
import { create } from 'zustand';

export interface User {
  userId: string;
  username: string;
  progress: number;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  createUser: (username: string) => User;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  createUser: (username) => ({
    userId: nanoid(),
    username,
    progress: 0,
  }),
}));

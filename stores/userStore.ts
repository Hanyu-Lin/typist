import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      createUser: (username) => {
        const newUser = {
          userId: nanoid(),
          username,
          progress: 0,
        };
        set({ user: newUser });
        return newUser;
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => localStorage), // storage location (localStorage)
    },
  ),
);

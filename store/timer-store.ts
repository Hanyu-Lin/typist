import { create } from "zustand";

const initialTimeConst = 60;
interface TimeState {
  time: number;
  timer: number;
  timerId: NodeJS.Timeout | null;
  tickDown: () => void;
  setTimerId: (timerId: NodeJS.Timeout | null) => void;
  setTimer: (time: number) => void;
  startTimer: () => void;
  resetTimeState: () => void;
}

export const useTimerStore = create<TimeState>((set) => ({
  time: initialTimeConst,
  timer: initialTimeConst,
  timerId: null,
  tickDown: () => {
    set((state) => {
      if (state.timer === 0) {
        clearInterval(state.timerId!);
        return { timerId: null };
      }
      return { timer: state.timer - 1 };
    });
  },
  setTimerId: (timerId) => set({ timerId }),
  setTimer: (time) => set({ time: time, timer: time }),
  startTimer: () =>
    set((state) => {
      if (state.timerId) return {};
      const timerId = setInterval(() => state.tickDown(), 1000);
      return { timerId };
    }),
  resetTimeState: () =>
    set((state) => {
      if (state.timerId) clearInterval(state.timerId);
      return { ...state, timer: state.time, timerId: null };
    }),
}));

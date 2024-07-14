import { create } from 'zustand';
import { generateWords } from '@/lib/utils';

interface TypingState {
  currWordIndex: number;
  typedWord: string;
  wordList: string[];
  typedHistory: string[];
  inputRef: React.RefObject<HTMLDivElement> | null;
  setInputRef: (inputRef: React.RefObject<HTMLDivElement>) => void;
  setTypedWord: (typedWord: string) => void;
  resetTypedWord: () => void;
  moveToNextWord: () => void;
  handleDelete: (deleteWholeWord: boolean) => void;
  resetTypingState: () => void;
}

export const useTypingStore = create<TypingState>((set) => ({
  currWordIndex: 0,
  typedWord: '',
  wordList: generateWords(250),
  typedHistory: [],
  inputRef: null,
  setInputRef: (inputRef) => set({ inputRef }),
  setTypedWord: (typedWord) => set({ typedWord }),
  resetTypedWord: () => set({ typedWord: '' }),
  moveToNextWord: () =>
    set((state) => ({
      typedWord: '',
      currWordIndex: state.currWordIndex + 1,
      typedHistory: [...state.typedHistory, state.typedWord],
    })),
  handleDelete: (isMetaKey: boolean) =>
    set((state) => {
      if (state.currWordIndex === 0 && state.typedWord === '') return {}; // No action if it's the first word and nothing is typed
      if (state.typedWord === '') {
        // If nothing is typed, delete the last misstyped word.
        if (
          state.typedHistory[state.typedHistory.length - 1] ===
          state.wordList[state.currWordIndex - 1]
        ) {
          return {};
        } else {
          return {
            typedHistory: state.typedHistory.slice(0, -1),
            currWordIndex: state.currWordIndex - 1,
            typedWord: state.typedHistory[state.typedHistory.length - 1],
          };
        }
      } else {
        if (isMetaKey) {
          return {
            typedWord: '',
          };
        } else {
          return {
            typedWord: state.typedWord.slice(0, -1),
          };
        }
      }
    }),
  resetTypingState: () =>
    set({
      currWordIndex: 0,
      wordList: generateWords(250),
      typedWord: '',
      typedHistory: [],
    }),
}));

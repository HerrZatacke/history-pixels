import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import dayjs from 'dayjs';

export interface Contribution {
  date: string,
  level: number,
}

export interface MainStoreState {
  contributions: Contribution[],
  year: number,
  setContribution: (date: string, level: number) => void,
  setYear: (year: number) => void,
  clearYear: (year: number) => void,
}

const byDate = (a: Contribution, b: Contribution) => {
  const dateA = dayjs(a.date).unix();
  const dateB = dayjs(b.date).unix();

  if (dateA > dateB) {
    return 1;
  }

  if (dateA < dateB) {
    return -1;
  }

  return 0;
};

const useMainStore = create(
  persist<MainStoreState>(
    (set, getState) => ({
      contributions: [],
      year: (new Date()).getFullYear(),

      setContribution: (date: string, level: number) => {
        const { contributions } = getState();

        const updated = contributions.filter((contribution) => contribution.date !== date);

        if (level > 0) {
          updated.push({
            date,
            level,
          });
        }

        set({
          contributions: updated.sort(byDate),
        });
      },
      clearYear: (year: number) => {
        const { contributions } = getState();
        const updated = contributions.filter((contribution) => dayjs(contribution.date).year() !== year);
        set({
          contributions: updated,
        });
      },
      setYear: (year: number) => {
        set({ year });
      },
    }),
    {
      name: 'history-pixels-main',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);


export default useMainStore;

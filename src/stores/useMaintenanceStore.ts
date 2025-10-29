import { create } from 'zustand';

interface MaintenanceStore {
  shouldRefetch: boolean;
  triggerRefetch: () => void;
  resetRefetch: () => void;
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
  shouldRefetch: false,
  triggerRefetch: () => set({ shouldRefetch: true }),
  resetRefetch: () => set({ shouldRefetch: false }),
}));

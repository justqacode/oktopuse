import { create } from 'zustand';

interface PaymentStore {
  shouldRefetch: boolean;
  triggerRefetch: () => void;
  resetRefetch: () => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  shouldRefetch: false,
  triggerRefetch: () => set({ shouldRefetch: true }),
  resetRefetch: () => set({ shouldRefetch: false }),
}));

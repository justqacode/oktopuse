export type Expenses = {
  id: number;
  date: string;
  category: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
};

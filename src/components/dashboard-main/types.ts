export type Expenses = {
  id: number;
  date: string;
  category: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
};

export type Properties = {
  id: number;
  propertyName: string;
  tenant: string;
  status: 'paid' | 'pending' | 'overdue';
};

export type Messages = {
  id: number;
  from: string;
  subject: string;
  date: string;
  status: 'sent' | 'received' | 'pending';
};

export type ManagerRequest = {
  id: number;
  date: string;
  property: string;
  tenant: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
};

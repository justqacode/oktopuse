export type Expenses = {
  id: number;
  date: string;
  category: string;
  amount: string;
  status: 'paid' | 'pending' | 'overdue';
};

export type Properties = {
  id: number;
  name: string;
  description?: string;
  date: string;
  images?: string;
  propertyType: string;
  amount: string;
  address: string;
};

export type Messages = {
  id: number;
  from: string;
  subject: string;
  date: string;
  status: 'sent' | 'received' | 'pending';
};

export type TenantRequest = {
  id: number;
  date: string;
  property: string;
  tenant: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  description: string;
};

export type ManagerRequest = {
  id: number;
  date: string;
  property: string;
  tenant: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
};

export type LandlordRequest = {
  id: number;
  date: string;
  property: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
};

export type LandlordRentHistory = {
  id: number;
  date: string;
  property: string;
  tenant: string;
  amount: string;
  method: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  statement: string;
};

export type PaymentHistoryManager = {
  id: number;
  paymentRef: string;
  date: string;
  amountReceived: string;
  note: string;
  status: string;
  docLink: string;
};

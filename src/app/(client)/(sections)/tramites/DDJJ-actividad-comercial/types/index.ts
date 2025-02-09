export interface Declaration {
  id: string;
  period: string;
  grossAmount: number;
  status: 'pending' | 'submitted' | 'paid';
  dueDate: string;
  submissionDate?: string;
  paymentDate?: string;
  paymentProof?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  taxId: string;
}

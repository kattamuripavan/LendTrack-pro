export type UserRole = 'ADMIN' | 'LENDER' | 'BORROWER' | 'ANALYST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';

export interface Loan {
  id: string;
  borrowerId: string;
  lenderId?: string;
  amount: number;
  interestRate: number; // Annual percentage
  term: number; // in months
  status: LoanStatus;
  createdAt: string;
  purpose: string;
  monthlyPayment: number;
  totalRepayable: number;
}

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface LoanApplication {
  borrowerId: string;
  amount: number;
  term: number;
  purpose: string;
}

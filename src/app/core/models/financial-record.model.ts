export enum FinancialRecordType {
  Income = 'Income',
  Expense = 'Expense',
}

export enum FinancialCategory {
  Services = 'Services',
  Suppliers = 'Suppliers',
  Rent = 'Rent',
  Payroll = 'Payroll',
  Utilities = 'Utilities',
  Other = 'Other',
}

export interface FinancialRecordResponse {
  id: number;
  type: FinancialRecordType;
  category: FinancialCategory;
  amount: number;
  amountBs?: number;
  description: string;
  date: string;
  userId: number;
  userName: string;
  createdAt: string;
}

export interface CreateFinancialRecordRequest {
  type: FinancialRecordType;
  category: FinancialCategory;
  amount: number;
  amountBs?: number;
  description: string;
  date: string;
  userId: number;
}

export interface UpdateFinancialRecordRequest {
  type: FinancialRecordType;
  category: FinancialCategory;
  amount: number;
  amountBs?: number;
  description: string;
  date: string;
}

export interface FinancialSummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
}

export interface CategorySummaryResponse {
  category: string;
  totalAmount: number;
  count: number;
}

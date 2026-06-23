import { AccountType } from './account.model';

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
  amountInBs?: number;
  description: string;
  date: string;
  userId: number;
  userName: string;
  createdAt: string;
  accountType: AccountType;
}

export interface CreateFinancialRecordRequest {
  type: FinancialRecordType;
  category: FinancialCategory;
  amount: number;
  amountInBs?: number;
  description: string;
  date: string;
  userId: number;
  accountType: AccountType;
}

export interface UpdateFinancialRecordRequest {
  type: FinancialRecordType;
  category: FinancialCategory;
  amount: number;
  amountInBs?: number;
  description: string;
  date: string;
  accountType: AccountType;
}

import { AccountBalance } from './account.model';

export interface FinancialSummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  incomeCount: number;
  expenseCount: number;
  balances: AccountBalance[];
}

export interface CategorySummaryResponse {
  category: string;
  totalAmount: number;
  count: number;
}

export interface DailySummaryResponse {
  date: string;
  income: number;
  expense: number;
}

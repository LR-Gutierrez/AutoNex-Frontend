export type RecurringExpenseFrequency =
  | 'Daily'
  | 'Weekly'
  | 'Biweekly'
  | 'Monthly'
  | 'Bimonthly'
  | 'Quarterly'
  | 'Yearly';

export interface RecurringExpenseResponse {
  id: number;
  name: string;
  amount: number;
  frequency: RecurringExpenseFrequency;
  dayOfMonth: number;
  accountType: 'Bolivares' | 'Dolares';
  type: 'Income' | 'Expense';
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateRecurringExpenseRequest {
  name: string;
  amount: number;
  frequency: RecurringExpenseFrequency;
  dayOfMonth: number;
  accountType: 'Bolivares' | 'Dolares';
  type: 'Income' | 'Expense';
  description?: string;
}

export interface UpdateRecurringExpenseRequest {
  name: string;
  amount: number;
  frequency: RecurringExpenseFrequency;
  dayOfMonth: number;
  accountType: 'Bolivares' | 'Dolares';
  type: 'Income' | 'Expense';
  isActive: boolean;
  description?: string;
}

export interface RecurringExpenseOccurrenceResponse {
  id: number;
  recurringExpenseId: number;
  expenseName: string;
  dueDate: string;
  amount: number;
  isPaid: boolean;
  paidDate?: string;
  paidAccountType?: 'Bolivares' | 'Dolares';
  dismissedDate?: string;
}

export interface PayRecurringExpenseRequest {
  accountType: 'Bolivares' | 'Dolares';
}

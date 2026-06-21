export type AccountType = 'Bolivares' | 'Dolares';

export interface AccountBalance {
  accountType: AccountType;
  balance: number;
  currency: string;
}

export interface AccountTransactionResponse {
  id: number;
  accountType: AccountType;
  type: 'Income' | 'Expense';
  amount: number;
  description: string;
  date: string;
  referenceType?: 'ServiceOrder' | 'FinancialRecord';
  referenceId?: number;
  createdAt: string;
}

export interface DashboardResponse {
  ordersToday: DashboardOrdersSummary;
  lowStock: { totalItems: number; items: DashboardLowStockItem[] };
  kmAlerts: DashboardAlertsSummary;
  financialMonth: DashboardMonthlyFinances;
}

export interface DashboardOrdersSummary {
  total: number;
  open: number;
  inProgress: number;
  completed: number;
  totalAmount: number;
}

export interface DashboardLowStockItem {
  id: number;
  name: string;
  stockQuantity: number;
  minStock: number;
}

export interface DashboardAlertsSummary {
  active: number;
  overdue: number;
}

export interface DashboardMonthlyFinances {
  income: number;
  expenses: number;
  balance: number;
}

export type PresetKey = 'today' | 'yesterday' | 'this-week' | 'this-month' | 'last-month' | 'custom';

export interface DateRange {
  preset: PresetKey;
  startDate: string;
  endDate: string;
  label: string;
}

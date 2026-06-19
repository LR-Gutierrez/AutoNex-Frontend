export const ExchangeRateStatus = {
  Draft: 1,
  Authorized: 2,
  Published: 3,
  Historical: 4,
} as const;

export type ExchangeRateStatusValue = (typeof ExchangeRateStatus)[keyof typeof ExchangeRateStatus];

export const EXCHANGE_RATE_STATUS_LABELS: Record<ExchangeRateStatusValue, string> = {
  [ExchangeRateStatus.Draft]: 'Borrador',
  [ExchangeRateStatus.Authorized]: 'Autorizado',
  [ExchangeRateStatus.Published]: 'Vigente',
  [ExchangeRateStatus.Historical]: 'Histórico',
};

export function getExchangeRateStatusLabel(status: number): string {
  return EXCHANGE_RATE_STATUS_LABELS[status as ExchangeRateStatusValue] ?? 'Desconocido';
}

export interface ExchangeRatePublication {
  id: number;
  publishedAt: string;
  valueDate: string;
  observations: string;
  status: ExchangeRateStatusValue;
  isActive?: boolean;
  exchangeRates: ExchangeRateItem[];
}

export interface ExchangeRateItem {
  id: number;
  value: number;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
}

export interface ExchangeRateListResponse {
  data: ExchangeRatePublication[];
  total: number;
  page: number;
  perPage: number;
}

export interface LiveRateResponse {
  currency: string;
  value: number;
}

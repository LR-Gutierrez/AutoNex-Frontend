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

export type BcvFetchAction =
  | 'Auto_Inserted'
  | 'Auto_Skipped_AlreadyPublished'
  | 'Auto_Skipped_AlreadyDraft'
  | 'Auto_Failed'
  | 'Manual_Inserted'
  | 'Manual_Skipped_AlreadyPublished'
  | 'Manual_Skipped_AlreadyDraft'
  | 'Manual_Failed'
  | 'Retry_Inserted'
  | 'Retry_Skipped_AlreadyPublished'
  | 'Retry_Skipped_AlreadyDraft'
  | 'Retry_Skipped_OutsideWindow'
  | 'Retry_Failed';

/** Extrae la parte semántica después del prefijo */
export function bcvActionKind(action: BcvFetchAction): string {
  return action.replace(/^(Auto|Manual|Retry)_/, '');
}

export type BcvFetchBy = 'Auto' | 'Manual' | 'Retry';

export interface BcvFetchLogResponse {
  id: number;
  valueDate: string;
  ratesJson: string | null;
  isSuccess: boolean;
  error: string | null;
  action: BcvFetchAction;
  fetchedBy: BcvFetchBy;
  fetchedAt: string;
}

export interface BcvFetchLogListResponse {
  data: BcvFetchLogResponse[];
  total: number;
  page: number;
  perPage: number;
}

export type SubscriptionResource =
  | 'PERSON'
  | 'ADMIN_USER'
  | 'ACTIVE_CELL'
  | 'CASH_ACCOUNT'
  | 'BANK_ACCOUNT'
  | 'STORAGE_BYTES'
  | 'ACTIVE_PERMISSION_GROUP';

export type SubscriptionFeature =
  | 'EXECUTIVE_DASHBOARD'
  | 'CUSTOM_TRANSLATIONS'
  | 'REPORT_TEMPLATE'
  | 'BASIC_EXPORT'
  | 'FULL_EXPORT'
  | 'PRIORITY_SUPPORT';

export interface SubscriptionResourceUsage {
  resource: SubscriptionResource;
  used: number;
  limitValue: number | null;
  remaining: number | null;
  warningPercentage: number;
  percentage: number;
  allowed: boolean;
}

export interface SubscriptionFeatureAvailability {
  feature: SubscriptionFeature;
  enabled: boolean;
}

export interface CurrentSubscription {
  planCode: 'FREE' | 'ESSENTIAL' | 'PREMIUM' | string;
  planName: string;
  priceMonthly: number;
  status: string;
  currentPeriodEndsAt?: string | null;
  gracePeriodEndsAt?: string | null;
  resources: SubscriptionResourceUsage[];
  features: SubscriptionFeatureAvailability[];
}

export interface CurrentSubscriptionResponse {
  subscription: CurrentSubscription;
}

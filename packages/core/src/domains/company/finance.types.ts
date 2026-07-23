import type { PaginatedApiResponse } from '../../core/types';

export interface FinanceMetricValueModel {
  percentChange: number | null;
  periodLabel: string | null;
  thisPeriod: number | null;
  total: number | null;
  trend?: 'UP' | 'DOWN' | 'NEUTRAL' | string | null;
}

export interface CompanyFinanceOverviewModel {
  alerts: unknown[] | null;
  billingSummary: CompanyFinanceInvoiceRowModel[] | null;
  linkedAccounts: unknown[] | null;
  outstandingBalance: FinanceMetricValueModel | null;
  pendingInvoices: FinanceMetricValueModel | null;
  projectsWithUnpaidBills: FinanceMetricValueModel | null;
  totalPaid: FinanceMetricValueModel | null;
}

export interface FinanceAlertModel {
  id: number | null;
  message: string | null;
}

export interface CompanyFinanceTransactionModel {
  id?: string | null;
  amount: number | null;
  date: string | null;
  invoiceNo: string | null;
  jobId?: string | null;
  project?: string | null;
  description?: string | null;
  type?: string | null;
  receiptUrl?: string | null;
  reference: string | null;
  status: string | null;
}

export interface CompanyFinanceInvoiceRowModel {
  id: string;
  amount: number;
  amountPaid: number;
  date: string;
  invoiceId: string;
  invoiceType: string;
  outstandingAmount: number;
  projectName: string;
  receiptUrl: string | null;
  status: string;
}

export interface FinanceBankModel {
  code: string;
  country: string;
  currency: string;
  longcode: string;
  name: string;
}

export interface ResolvedWalletAccountModel {
  account_name: string;
  account_number: string;
  bank_id: number;
}

export interface ResolveWalletAccountPayload extends Record<string, unknown> {
  accountNumber: string;
  bankCode: string;
}

export interface CompanyFinanceLinkBankPayload {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  isDefault: boolean;
}

export interface CompanyInvoiceModel {
  id: string;
  invoiceNumber: string;
  jobRequestId: string;
  invoiceType: string;
  invoiceDate: string;
  currency: string;
  customerName: string;
  status: string;
  grandTotal: number;
  [key: string]: unknown;
}

export interface CompanyInvoicePayPayload {
  amountPaid: number;
  paymentMethod: string;
  bankName: string;
  transactionPin: string;
  notes: string;
}

export type CompanyInvoicePaymentType = 'FULL' | 'PART';

export interface CompanyInitializeInvoicePaymentPayload {
  invoiceIds: string[];
  paymentType: CompanyInvoicePaymentType;
  partialAmount?: number;
  cancelPage: string;
  successPage: string;
}

export interface CompanyInitializeInvoicePaymentModel {
  reference?: string | null;
  authorization_url?: string | null;
  access_code?: string | null;
  paymentUrl?: string | null;
  authorizationUrl?: string | null;
  checkoutUrl?: string | null;
  [key: string]: unknown;
}

export interface CompanyFinancePaymentPreviewPayload {
  invoiceIds: string[];
  bankAccountId: string;
  transactionPin: string;
  confirmDetails: boolean;
}

export interface CompanyFinancePaymentPreviewModel {
  amountPaid: number | null;
  paymentMethod: string | null;
  paymentRef: string | null;
  paymentTime: string | null;
  refNumber: string | null;
  senderName: string | null;
  status: string | null;
}

export interface CompanyFinancePaymentConfirmPayload {
  paymentRef: string;
  otp: string;
}

export type CompanyFinanceTransactionListModel =
  PaginatedApiResponse<CompanyFinanceTransactionModel>;
export type CompanyFinanceBillingSummaryListModel =
  PaginatedApiResponse<CompanyFinanceInvoiceRowModel>;
export type CompanyProjectFinanceInvoiceListModel =
  PaginatedApiResponse<CompanyFinanceInvoiceRowModel>;

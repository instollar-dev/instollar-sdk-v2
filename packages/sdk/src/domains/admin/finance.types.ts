import type { PaginatedApiResponse } from '../../core/types';

export interface FinanceMetricModel {
  percentChange: number;
  thisPeriod: number;
  total: number;
  periodLabel?: string;
}

export interface AdminFinanceOverviewModel {
  grossProfit: FinanceMetricModel;
  grossRevenue: FinanceMetricModel;
  installerPayouts: FinanceMetricModel;
  pendingInvoicesCount: number;
  pendingPayouts: FinanceMetricModel;
  period: string;
  projectsWithUnpaidBills: number;
  totalInvoicesCount: number;
  totalOutstandingBalance: FinanceMetricModel;
}

export interface FinanceTransactionModel {
  amount: number;
  companyName: string | null;
  date: string;
  installerName: string | null;
  status: string;
  transactionId: string;
  transactionType: string;
}

export interface GenerateFinancialReportPayload {
  reportName: string;
  reportType: string;
  reportFormat: string;
  filterBy: string;
  fromDate?: string;
  toDate?: string;
  companyId?: string;
  installerId?: string;
}

export interface GenerateFinancialReportModel {
  generatedAt: string;
  headers: string[];
  reportFormat: string;
  reportName: string;
  reportType: string;
  rows: string[][];
}

export interface InstallerWalletModel {
  balance: number;
  installerId: string;
  installerName: string;
  lastTransaction: string | null;
  pendingPayouts: number;
  phone: string | null;
  totalEarned: number;
}

export interface UnpaidProjectModel {
  amount: number;
  companyName: string;
  dateCompleted: string;
  id: string;
  name: string;
  projectId: string;
  status: 'unpaid';
}

export interface UnpaidInstallerModel {
  amount: number;
  date: string;
  id: string;
  installerId: string;
  name: string;
  phone: string;
}

export interface PayoutPreviewPayload {
  installerIds: string[];
  masterAccountId?: string;
  transactionPin: string;
  useWallet: boolean;
}

export interface PayoutPreviewModel {
  batchRef: string;
  installerCount: number;
  items: unknown[];
  totalAmount: number;
  totalFee: number;
}

export interface PayoutConfirmPayload {
  batchRef: string;
  otp: string;
}

export interface CompanyFinanceModel {
  companyId: string;
  companyName: string;
  lastTransaction: string | null;
  pendingPayments: number;
  totalAmountSpent: number;
  totalProjects: number;
}

export interface CompanyBillingSummaryModel {
  amount: number;
  createdBy: string;
  dueDate: string;
  invoiceId: string;
  invoiceType: string;
  projectName: string;
  status: string;
}

export interface TopPayingCompanyModel {
  amountPaid: number;
  companyId: string;
  companyName: string;
  numberOfProjects: number;
  rank: number;
}

export interface CompanyFinanceMetricModel {
  percentChange: number;
  periodLabel: string;
  thisPeriod: number;
  total: number;
}

export interface CompaniesFinanceOverviewModel {
  activePayingCompanies: CompanyFinanceMetricModel;
  failedDisputedPayments: CompanyFinanceMetricModel;
  outstandingInvoices: CompanyFinanceMetricModel;
  topPayingCompanies: TopPayingCompanyModel[];
  totalCompanyPayments: CompanyFinanceMetricModel;
}

export interface PaymentReminderPayload {
  companyIds: string[];
}

export interface PaymentGatewayConfigModel {
  accountNumber: string;
  createdAt: string;
  gateway: string;
  id: string;
  link: string;
  masterAccount: boolean;
}

export interface SavePaymentGatewayPayload {
  gateway: string;
  accountNumber: string;
  link: string;
  secretKey?: string;
  masterAccount: boolean;
}

export interface MasterAccountModel {
  accountNumber: string;
  gateway: string;
  link: string;
  masterAccountId: string;
}

export interface SetTransactionPinPayload {
  pin: string;
  confirmPin: string;
}

export interface UpdateTransactionPinPayload {
  currentPin: string;
  newPin: string;
  confirmNewPin: string;
}

export interface PinStatusModel {
  pinSet: boolean;
}

export interface FinanceAuditTrailItemModel {
  id: string;
  action: string;
  description: string;
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: string;
  referenceId: string;
  metadata?: Record<string, unknown>;
}

export interface InstallerFinanceProjectModel {
  id: string;
  projectId: string;
  name: string;
  companyName: string;
  status: string;
  amount: number;
  dateCompleted: string;
}

export type FinanceTransactionListModel = PaginatedApiResponse<FinanceTransactionModel>;
export type InstallerWalletListModel = PaginatedApiResponse<InstallerWalletModel>;
export type UnpaidProjectListModel = PaginatedApiResponse<UnpaidProjectModel>;
export type UnpaidInstallerListModel = PaginatedApiResponse<UnpaidInstallerModel>;
export type CompanyFinanceListModel = PaginatedApiResponse<CompanyFinanceModel>;
export type CompanyBillingSummaryListModel = PaginatedApiResponse<CompanyBillingSummaryModel>;
export type FinanceAuditTrailListModel = PaginatedApiResponse<FinanceAuditTrailItemModel>;
export type InstallerFinanceProjectListModel = PaginatedApiResponse<InstallerFinanceProjectModel>;

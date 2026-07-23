import type { ApiResponse, PaginatedApiResponse } from '../../core/types';

export type InstallerWalletStatusModel =
  | 'NOT_CREATED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'COMPLETE';

export interface InstallerFinanceWalletModel {
  balance: number;
  bankLinked: boolean;
  idVerified: boolean;
  installerId: string;
  installerName: string;
  pinCreated: boolean;
  setupComplete: boolean;
  totalReceived: number;
  totalWithdrawn: number;
  walletCreated: boolean;
  walletId: string;
  walletStatus: InstallerWalletStatusModel;
}

export interface InstallerWalletStatMetricModel {
  percentChange: number | null;
  periodLabel: string | null;
  thisPeriod: number | null;
  total: number | null;
  trend: 'UP' | 'DOWN' | 'NEUTRAL' | string | null;
}

export interface InstallerWalletStatsModel {
  totalReceived: InstallerWalletStatMetricModel;
  totalWithdrawn: InstallerWalletStatMetricModel;
}

export interface InstallerWalletTransactionModel {
  amount: number;
  createdAt: string;
  description: string;
  id: string;
  status: string;
  transactionRef: string;
  type: string;
}

export interface CreateWalletPinPayload {
  transactionPin: string;
  confirmTransactionPin: string;
}

export interface CreateInstallerWalletPayload {
  fullName: string;
  phoneNumber: string;
  email: string;
  idType: string;
  idNumber: string;
}

export interface CreateInstallerWalletModel {
  verificationRef?: string;
}

export interface VerifyInstallerWalletIdPayload {
  otp: string;
  verificationRef: string;
}

export interface InstallerFinanceBankModel {
  code: string;
  country: string;
  currency: string;
  longcode: string;
  name: string;
}

export interface AddInstallerBankAccountPayload {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  isDefault: boolean;
}

export interface WalletBankAccountModel {
  id: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  default: boolean;
}

export interface InitiateWalletWithdrawalPayload {
  amount: number;
  accountId: string;
  withdrawalPin: string;
}

export interface ConfirmWalletWithdrawalPayload {
  otp: string;
  transactionRef: string;
}

export interface InstallerPensionPlanModel {
  id: string;
  monthlyContributionAmount: number | null;
  nextDeductionDate: string | null;
  penNumber: string | null;
  pensionProviderName: string | null;
  pfaName: string | null;
  planFrequency: string | null;
  rsaPin: string | null;
  rsaStatementUrl: string | null;
  source: string;
  status: string;
  totalContributed: number;
  walletLinked: boolean;
}

export interface PensionNextOfKinPayload {
  fullName: string;
  phoneNumber: string;
  relationship: string;
}

export interface LinkInstallerPensionPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idType: string;
  idNumber: string;
  rsaPin: string;
  pfaName: string;
  rsaStatementUrl: string;
  consent: boolean;
}

export interface EnrollInstallerPensionPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  idType: string;
  idNumber: string;
  nextOfKin: PensionNextOfKinPayload;
  walletLinked: boolean;
}

export interface InstallerHmoDetailsModel {
  enrolleeMembershipId: string | null;
  hmoIdProofUrl: string | null;
  hmoNumber: string | null;
  hmoProviderName: string | null;
  id: string;
  monthlyContributionAmount: number | null;
  nextDeductionDate: string | null;
  planFrequency: string | null;
  planType: string | null;
  source: string;
  status: string;
  totalContributed: number;
  walletLinked: boolean;
}

export interface LinkInstallerHmoPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idType: string;
  idNumber: string;
  hmoProviderName: string;
  planType: string;
  enrolleeMembershipId: string;
  hmoIdProofUrl: string;
  consent: boolean;
}

export interface EnrollInstallerHmoPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  idType: string;
  idNumber: string;
  nextOfKin: PensionNextOfKinPayload;
  walletLinked: boolean;
}

export interface ContactProviderPayload {
  fullName: string;
  email: string;
  shortMessage: string;
}

export interface PensionContributionHistoryItemModel {
  id: string;
  createdAt?: string | null;
  amount?: number | null;
  status?: string | null;
  type?: string | null;
  description?: string | null;
}

export interface PensionContributionHistoryModel {
  content: PensionContributionHistoryItemModel[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface InstallerContributionHistoryItemModel {
  id: string;
  createdAt?: string | null;
  amount?: number | null;
  status?: string | null;
  type?: string | null;
  description?: string | null;
}

export type InstallerFinanceTransactionListModel =
  PaginatedApiResponse<InstallerWalletTransactionModel>;

export type InstallerHmoContributionListModel = ApiResponse<
  InstallerContributionHistoryItemModel[]
> & {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
};

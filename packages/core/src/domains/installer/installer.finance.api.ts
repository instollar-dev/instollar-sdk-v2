import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  AddInstallerBankAccountPayload,
  ConfirmWalletWithdrawalPayload,
  ContactProviderPayload,
  CreateInstallerWalletModel,
  CreateInstallerWalletPayload,
  CreateWalletPinPayload,
  EnrollInstallerHmoPayload,
  EnrollInstallerPensionPayload,
  InitiateWalletWithdrawalPayload,
  InstallerFinanceBankModel,
  InstallerFinanceTransactionListModel,
  InstallerFinanceWalletModel,
  InstallerHmoContributionListModel,
  InstallerHmoDetailsModel,
  InstallerPensionPlanModel,
  InstallerWalletStatsModel,
  LinkInstallerHmoPayload,
  LinkInstallerPensionPayload,
  PensionContributionHistoryModel,
  VerifyInstallerWalletIdPayload,
  WalletBankAccountModel,
} from './finance.types';
import type {
  ResolveWalletAccountPayload,
  ResolvedWalletAccountModel,
} from '../company/finance.types';

const silent = { showSuccessToast: false } as const;

export const installerFinanceApi = {
  getFinanceWallet: (): Promise<ApiResponse<InstallerFinanceWalletModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerFinanceWalletModel>>(
        apiUrl('installer', installerPaths.financeWallet),
        {},
        {},
        silent,
      ),
    ),

  getInstallerWalletStats: (): Promise<ApiResponse<InstallerWalletStatsModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerWalletStatsModel>>(
        apiUrl('installer', installerPaths.financeWalletStats),
        {},
        {},
        silent,
      ),
    ),

  getInstallerHmoContributionHistory: (
    params?: Record<string, unknown>,
  ): Promise<InstallerHmoContributionListModel> =>
    unwrap(
      api.get<InstallerHmoContributionListModel>(
        apiUrl('installer', installerPaths.financeHmoContributions),
        params,
        {},
        silent,
      ),
    ),

  createWalletPin: (payload: CreateWalletPinPayload): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.financeWalletCreatePin),
        payload,
        {},
        silent,
      ),
    ),

  createInstallerWallet: (
    payload: CreateInstallerWalletPayload,
  ): Promise<ApiResponse<CreateInstallerWalletModel>> =>
    unwrap(
      api.post<ApiResponse<CreateInstallerWalletModel>>(
        apiUrl('installer', installerPaths.financeWalletCreate),
        payload,
        {},
        silent,
      ),
    ),

  verifyInstallerWalletId: (
    payload: VerifyInstallerWalletIdPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.financeWalletVerifyId),
        payload,
        {},
        silent,
      ),
    ),

  getFinanceBanks: (): Promise<ApiResponse<InstallerFinanceBankModel[]>> =>
    unwrap(
      api.get<ApiResponse<InstallerFinanceBankModel[]>>(
        apiUrl('installer', installerPaths.financeBanks),
        {},
        {},
        silent,
      ),
    ),

  addInstallerBankAccount: (
    payload: AddInstallerBankAccountPayload,
  ): Promise<ApiResponse<WalletBankAccountModel>> =>
    unwrap(
      api.post<ApiResponse<WalletBankAccountModel>>(
        apiUrl('installer', installerPaths.financeWalletLinkBank),
        payload,
        {},
        silent,
      ),
    ),

  resolveWalletAccountName: (
    payload: ResolveWalletAccountPayload,
  ): Promise<ApiResponse<ResolvedWalletAccountModel>> =>
    unwrap(
      api.get<ApiResponse<ResolvedWalletAccountModel>>(
        apiUrl('installer', installerPaths.financeWalletResolveAccount),
        payload,
        {},
        silent,
      ),
    ),

  getWalletBankAccounts: (): Promise<ApiResponse<WalletBankAccountModel[]>> =>
    unwrap(
      api.get<ApiResponse<WalletBankAccountModel[]>>(
        apiUrl('installer', installerPaths.financeWalletBankAccounts),
        {},
        {},
        silent,
      ),
    ),

  deleteInstallerBankAccount: (bankAccountId: string): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.delete<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.financeWalletBankAccount(bankAccountId)),
        {},
        {},
        silent,
      ),
    ),

  initiateWalletWithdrawal: (
    payload: InitiateWalletWithdrawalPayload,
  ): Promise<ApiResponse<string>> =>
    unwrap(
      api.post<ApiResponse<string>>(
        apiUrl('installer', installerPaths.financeInitiateWithdrawal),
        payload,
        {},
        silent,
      ),
    ),

  confirmWalletWithdrawal: (
    payload: ConfirmWalletWithdrawalPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.financeConfirmWithdrawal),
        payload,
        {},
        silent,
      ),
    ),

  getInstallerPensionDetails: (): Promise<ApiResponse<InstallerPensionPlanModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerPensionPlanModel>>(
        apiUrl('installer', installerPaths.financePension),
        {},
        {},
        silent,
      ),
    ),

  getInstallerPensionContributionHistory: (
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<PensionContributionHistoryModel>> =>
    unwrap(
      api.get<ApiResponse<PensionContributionHistoryModel>>(
        apiUrl('installer', installerPaths.financePensionContributions),
        params,
        {},
        silent,
      ),
    ),

  contactInstallerPensionProvider: (
    payload: ContactProviderPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.financePensionContactProvider),
        payload,
        {},
        silent,
      ),
    ),

  linkInstallerPension: (
    payload: LinkInstallerPensionPayload,
  ): Promise<ApiResponse<InstallerPensionPlanModel>> =>
    unwrap(
      api.post<ApiResponse<InstallerPensionPlanModel>>(
        apiUrl('installer', installerPaths.financePensionLink),
        payload,
        {},
        silent,
      ),
    ),

  enrollInstallerPension: (
    payload: EnrollInstallerPensionPayload,
  ): Promise<ApiResponse<InstallerPensionPlanModel>> =>
    unwrap(
      api.post<ApiResponse<InstallerPensionPlanModel>>(
        apiUrl('installer', installerPaths.financePensionEnroll),
        payload,
        {},
        silent,
      ),
    ),

  getInstallerHmoDetails: (): Promise<ApiResponse<InstallerHmoDetailsModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerHmoDetailsModel>>(
        apiUrl('installer', installerPaths.financeHmo),
        {},
        {},
        silent,
      ),
    ),

  linkInstallerHmo: (
    payload: LinkInstallerHmoPayload,
  ): Promise<ApiResponse<InstallerHmoDetailsModel>> =>
    unwrap(
      api.post<ApiResponse<InstallerHmoDetailsModel>>(
        apiUrl('installer', installerPaths.financeHmoLink),
        payload,
        {},
        silent,
      ),
    ),

  enrollInstallerHmo: (
    payload: EnrollInstallerHmoPayload,
  ): Promise<ApiResponse<InstallerHmoDetailsModel>> =>
    unwrap(
      api.post<ApiResponse<InstallerHmoDetailsModel>>(
        apiUrl('installer', installerPaths.financeHmoEnroll),
        payload,
        {},
        silent,
      ),
    ),

  contactInstallerHmoProvider: (
    payload: ContactProviderPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.financeHmoContactProvider),
        payload,
        {},
        silent,
      ),
    ),

  getInstallerFinanceTransactions: (
    params?: Record<string, unknown>,
  ): Promise<InstallerFinanceTransactionListModel> =>
    unwrap(
      api.get<InstallerFinanceTransactionListModel>(
        apiUrl('installer', installerPaths.financeWalletTransactions),
        params,
        {},
        silent,
      ),
    ),
};

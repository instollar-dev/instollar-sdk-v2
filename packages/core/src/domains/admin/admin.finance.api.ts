import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  AdminFinanceOverviewModel,
  CompaniesFinanceOverviewModel,
  CompanyBillingSummaryListModel,
  CompanyFinanceListModel,
  FinanceAuditTrailListModel,
  FinanceTransactionListModel,
  GenerateFinancialReportModel,
  GenerateFinancialReportPayload,
  InstallerFinanceProjectListModel,
  InstallerWalletListModel,
  MasterAccountModel,
  PaymentGatewayConfigModel,
  PaymentReminderPayload,
  PayoutConfirmPayload,
  PayoutPreviewModel,
  PayoutPreviewPayload,
  PinStatusModel,
  SavePaymentGatewayPayload,
  SetTransactionPinPayload,
  UnpaidInstallerListModel,
  UnpaidProjectListModel,
  UpdateTransactionPinPayload,
} from './finance.types';

const silent = { showSuccessToast: false } as const;

export const adminFinanceApi = {
  getFinanceOverview: (
    filter: string,
  ): Promise<ApiResponse<AdminFinanceOverviewModel>> =>
    unwrap(
      api.get<ApiResponse<AdminFinanceOverviewModel>>(
        apiUrl('admin', adminPaths.financeOverview),
        { filter },
        {},
        silent,
      ),
    ),

  getTransactions: (
    params?: Record<string, unknown>,
  ): Promise<FinanceTransactionListModel> =>
    unwrap(
      api.get<FinanceTransactionListModel>(
        apiUrl('admin', adminPaths.financeTransactions),
        params,
        {},
        silent,
      ),
    ),

  generateFinancialReport: (
    payload: GenerateFinancialReportPayload,
  ): Promise<ApiResponse<GenerateFinancialReportModel>> =>
    unwrap(
      api.post<ApiResponse<GenerateFinancialReportModel>>(
        apiUrl('admin', adminPaths.financeReportsGenerate),
        payload,
        {},
        silent,
      ),
    ),

  getInstallerWallets: (
    params?: Record<string, unknown>,
  ): Promise<InstallerWalletListModel> =>
    unwrap(
      api.get<InstallerWalletListModel>(
        apiUrl('admin', adminPaths.financeInstallerWallets),
        params,
        {},
        silent,
      ),
    ),

  getUnpaidProjects: (
    installerId: string,
    params?: Record<string, unknown>,
  ): Promise<UnpaidProjectListModel> =>
    unwrap(
      api.get<UnpaidProjectListModel>(
        apiUrl('admin', adminPaths.financeUnpaidProjects(installerId)),
        params,
        {},
        silent,
      ),
    ),

  getUnpaidInstallers: (
    params?: Record<string, unknown>,
  ): Promise<UnpaidInstallerListModel> =>
    unwrap(
      api.get<UnpaidInstallerListModel>(
        apiUrl('admin', adminPaths.financeUnpaidInstallers),
        params,
        {},
        silent,
      ),
    ),

  exportUnpaidInstallers: (): Promise<Blob> =>
    unwrap(
      api.get<Blob>(
        apiUrl('admin', adminPaths.financeUnpaidExport),
        {},
        { responseType: 'blob' },
        silent,
      ),
    ),

  previewBulkPayout: (
    payload: PayoutPreviewPayload,
  ): Promise<ApiResponse<PayoutPreviewModel>> =>
    unwrap(
      api.post<ApiResponse<PayoutPreviewModel>>(
        apiUrl('admin', adminPaths.financePayoutPreview),
        payload,
        {},
        silent,
      ),
    ),

  confirmBulkPayout: (payload: PayoutConfirmPayload): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.financePayoutConfirm),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getCompaniesFinance: (
    params?: Record<string, unknown>,
  ): Promise<CompanyFinanceListModel> =>
    unwrap(
      api.get<CompanyFinanceListModel>(
        apiUrl('admin', adminPaths.financeCompanies),
        params,
        {},
        silent,
      ),
    ),

  getCompanyTransactions: (
    companyId: string,
    params?: Record<string, unknown>,
  ): Promise<FinanceTransactionListModel> =>
    unwrap(
      api.get<FinanceTransactionListModel>(
        apiUrl('admin', adminPaths.financeCompanyTransactions(companyId)),
        params,
        {},
        silent,
      ),
    ),

  getCompanyBillingSummary: (
    companyId: string,
    params?: Record<string, unknown>,
  ): Promise<CompanyBillingSummaryListModel> =>
    unwrap(
      api.get<CompanyBillingSummaryListModel>(
        apiUrl('admin', adminPaths.financeCompanyBillingSummary(companyId)),
        params,
        {},
        silent,
      ),
    ),

  getCompaniesFinanceOverview: (): Promise<ApiResponse<CompaniesFinanceOverviewModel>> =>
    unwrap(
      api.get<ApiResponse<CompaniesFinanceOverviewModel>>(
        apiUrl('admin', adminPaths.financeCompaniesOverview),
        {},
        {},
        silent,
      ),
    ),

  sendPaymentReminder: (payload: PaymentReminderPayload): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.financePaymentReminder),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  savePaymentGateway: (
    payload: SavePaymentGatewayPayload,
  ): Promise<ApiResponse<PaymentGatewayConfigModel>> =>
    unwrap(
      api.post<ApiResponse<PaymentGatewayConfigModel>>(
        apiUrl('admin', adminPaths.financeConfigPaymentGateway),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getPaymentGateway: (): Promise<ApiResponse<PaymentGatewayConfigModel>> =>
    unwrap(
      api.get<ApiResponse<PaymentGatewayConfigModel>>(
        apiUrl('admin', adminPaths.financeConfigPaymentGateway),
        {},
        {},
        silent,
      ),
    ),

  getMasterAccount: (): Promise<ApiResponse<MasterAccountModel>> =>
    unwrap(
      api.get<ApiResponse<MasterAccountModel>>(
        apiUrl('admin', adminPaths.financeConfigMasterAccount),
        {},
        {},
        silent,
      ),
    ),

  setTransactionPin: (payload: SetTransactionPinPayload): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.financeConfigPinSet),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateTransactionPin: (
    payload: UpdateTransactionPinPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.put<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.financeConfigPinUpdate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getPinStatus: (): Promise<ApiResponse<PinStatusModel>> =>
    unwrap(
      api.get<ApiResponse<PinStatusModel>>(
        apiUrl('admin', adminPaths.financeConfigPinStatus),
        {},
        {},
        silent,
      ),
    ),

  getFinanceAuditTrail: (params?: {
    page?: number;
    limit?: number;
  }): Promise<FinanceAuditTrailListModel> =>
    unwrap(
      api.get<FinanceAuditTrailListModel>(
        apiUrl('admin', adminPaths.financeAuditTrail),
        params,
        {},
        silent,
      ),
    ),

  getInstallerProjects: (
    installerId: string,
    params?: Record<string, unknown>,
  ): Promise<InstallerFinanceProjectListModel> =>
    unwrap(
      api.get<InstallerFinanceProjectListModel>(
        apiUrl('admin', adminPaths.financeInstallerProjects(installerId)),
        params,
        {},
        silent,
      ),
    ),
};

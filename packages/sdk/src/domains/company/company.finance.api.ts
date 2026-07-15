import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { companyPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  CompanyFinanceBillingSummaryListModel,
  CompanyFinanceLinkBankPayload,
  CompanyFinanceOverviewModel,
  CompanyFinancePaymentConfirmPayload,
  CompanyFinancePaymentPreviewModel,
  CompanyFinancePaymentPreviewPayload,
  CompanyFinanceTransactionListModel,
  CompanyInitializeInvoicePaymentModel,
  CompanyInitializeInvoicePaymentPayload,
  CompanyInvoiceModel,
  CompanyInvoicePayPayload,
  CompanyProjectFinanceInvoiceListModel,
  FinanceAlertModel,
  FinanceBankModel,
  ResolveWalletAccountPayload,
  ResolvedWalletAccountModel,
} from './finance.types';

const silent = { showSuccessToast: false } as const;

export const companyFinanceApi = {
  getFinance: (): Promise<ApiResponse<CompanyFinanceOverviewModel>> =>
    unwrap(
      api.get<ApiResponse<CompanyFinanceOverviewModel>>(
        apiUrl('company', companyPaths.financeOverview),
        {},
        {},
        silent,
      ),
    ),

  getNotifications: (): Promise<ApiResponse<FinanceAlertModel[]>> =>
    unwrap(
      api.get<ApiResponse<FinanceAlertModel[]>>(
        apiUrl('base', companyPaths.notificationsBase),
        {},
        {},
        silent,
      ),
    ),

  getCompanyFinanceTransactions: (
    params?: Record<string, unknown>,
  ): Promise<CompanyFinanceTransactionListModel> =>
    unwrap(
      api.get<CompanyFinanceTransactionListModel>(
        apiUrl('company', companyPaths.financeTransactions),
        params,
        {},
        silent,
      ),
    ),

  getCompanyFinanceBillingSummary: (
    params?: Record<string, unknown>,
  ): Promise<CompanyFinanceBillingSummaryListModel> =>
    unwrap(
      api.get<CompanyFinanceBillingSummaryListModel>(
        apiUrl('company', companyPaths.financeBillingSummary),
        params,
        {},
        silent,
      ),
    ),

  getCompanyProjectFinanceInvoices: (
    projectId: string,
  ): Promise<CompanyProjectFinanceInvoiceListModel> =>
    unwrap(
      api.get<CompanyProjectFinanceInvoiceListModel>(
        apiUrl('company', companyPaths.financeProjectInvoices(projectId)),
        {},
        {},
        silent,
      ),
    ),

  getCompanyFinanceBanks: (): Promise<ApiResponse<FinanceBankModel[]>> =>
    unwrap(
      api.get<ApiResponse<FinanceBankModel[]>>(
        apiUrl('company', companyPaths.financeBanks),
        {},
        {},
        silent,
      ),
    ),

  resolveCompanyFinanceAccountName: (
    payload: ResolveWalletAccountPayload,
  ): Promise<ApiResponse<ResolvedWalletAccountModel>> =>
    unwrap(
      api.get<ApiResponse<ResolvedWalletAccountModel>>(
        apiUrl('company', companyPaths.financeResolveAccount),
        payload,
        {},
        silent,
      ),
    ),

  linkCompanyFinanceBankAccount: (
    payload: CompanyFinanceLinkBankPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('company', companyPaths.financeLinkBankAccount),
        payload,
        {},
        silent,
      ),
    ),

  getCompanyInvoiceById: (invoiceId: string): Promise<ApiResponse<CompanyInvoiceModel>> =>
    unwrap(
      api.get<ApiResponse<CompanyInvoiceModel>>(
        apiUrl('company', companyPaths.invoiceById(invoiceId)),
        {},
        {},
        silent,
      ),
    ),

  payCompanyInvoice: (
    invoiceId: string,
    payload: CompanyInvoicePayPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('company', companyPaths.invoicePay(invoiceId)),
        payload,
        {},
        silent,
      ),
    ),

  initializeCompanyInvoicePayment: (
    payload: CompanyInitializeInvoicePaymentPayload,
  ): Promise<ApiResponse<CompanyInitializeInvoicePaymentModel>> =>
    unwrap(
      api.post<ApiResponse<CompanyInitializeInvoicePaymentModel>>(
        apiUrl('company', companyPaths.financeInitializePayment),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  previewCompanyFinancePayment: (
    companyId: string,
    payload: CompanyFinancePaymentPreviewPayload,
  ): Promise<ApiResponse<CompanyFinancePaymentPreviewModel>> =>
    unwrap(
      api.post<ApiResponse<CompanyFinancePaymentPreviewModel>>(
        apiUrl('company', companyPaths.financePaymentPreview(companyId)),
        payload,
        {},
        silent,
      ),
    ),

  confirmCompanyFinancePayment: (
    companyId: string,
    payload: CompanyFinancePaymentConfirmPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('company', companyPaths.financePaymentConfirm(companyId)),
        payload,
        {},
        silent,
      ),
    ),
};

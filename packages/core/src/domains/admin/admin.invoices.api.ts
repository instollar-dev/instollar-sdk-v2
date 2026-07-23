import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, PaginatedApiResponse } from '../../core/types';
import type {
  CreateInvoicePayload,
  InvoiceModel,
  InvoiceSettingsModel,
  UpdateInvoicePayload,
  UpdateInvoiceSettingsPayload,
} from './invoice.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminInvoicesApi = {
  createInvoice: (
    jobRequestId: string,
    payload: CreateInvoicePayload,
  ): Promise<ApiResponse<InvoiceModel>> =>
    unwrap(
      api.post<ApiResponse<InvoiceModel>>(
        apiUrl('admin', adminPaths.invoiceCreate(jobRequestId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  sendInvoice: (invoiceId: string): Promise<ApiResponse<InvoiceModel>> =>
    unwrap(
      api.post<ApiResponse<InvoiceModel>>(
        apiUrl('admin', adminPaths.invoiceSend(invoiceId)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  getAllInvoices: (
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<InvoiceModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<InvoiceModel>>(
        apiUrl('admin', adminPaths.invoicesGetAll),
        params,
        {},
        silent,
      ),
    ),

  updateInvoice: (
    invoiceId: string,
    payload: UpdateInvoicePayload,
  ): Promise<ApiResponse<InvoiceModel>> =>
    unwrap(
      api.patch<ApiResponse<InvoiceModel>>(
        apiUrl('admin', adminPaths.invoiceUpdate(invoiceId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getInvoiceById: (invoiceId: string): Promise<ApiResponse<InvoiceModel>> =>
    unwrap(
      api.get<ApiResponse<InvoiceModel>>(
        apiUrl('admin', adminPaths.invoiceById(invoiceId)),
        {},
        {},
        silent,
      ),
    ),

  getInvoiceByJobRequestId: (jobRequestId: string): Promise<ApiResponse<InvoiceModel>> =>
    unwrap(
      api.get<ApiResponse<InvoiceModel>>(
        apiUrl('admin', adminPaths.invoiceByJobRequest(jobRequestId)),
        {},
        {},
        silent,
      ),
    ),

  getInvoiceSettings: (): Promise<ApiResponse<InvoiceSettingsModel>> =>
    unwrap(
      api.get<ApiResponse<InvoiceSettingsModel>>(
        apiUrl('admin', adminPaths.invoiceSettings),
        {},
        {},
        silent,
      ),
    ),

  updateInvoiceSettings: (
    payload: UpdateInvoiceSettingsPayload,
  ): Promise<ApiResponse<InvoiceSettingsModel>> =>
    unwrap(
      api.patch<ApiResponse<InvoiceSettingsModel>>(
        apiUrl('admin', adminPaths.invoiceSettings),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteInvoice: (invoiceId: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.delete<ApiResponse<null>>(
        apiUrl('admin', adminPaths.invoiceDelete(invoiceId)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),
};

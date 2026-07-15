import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, PaginatedApiResponse } from '../../core/types';
import { adminCatalogApi } from './admin.catalog.api';
import { adminCrmApi } from './admin.crm.api';
import { adminFinanceApi } from './admin.finance.api';
import { adminAnalyticsApi } from './admin.analytics.api';
import { adminInvoicesApi } from './admin.invoices.api';
import { adminJobRequestsApi } from './admin.job-requests.api';
import { adminMeshGridApi } from './admin.mesh-grid.api';
import { adminNotificationsApi } from './admin.notifications.api';
import { adminOnboardingApi } from './admin.onboarding.api';
import { adminRolesApi } from './admin.roles.api';
import { adminSiteAuditApi } from './admin.site-audit.api';
import { adminWorkflowsApi } from './admin.workflows.api';
import type {
  AdminInstallerProfileModel,
  AdminStatsModel,
  AssignInstallerPayload,
  AssignInstallerResultModel,
  InstallerSearchPayload,
  InstallerSearchResultModel,
  JobRequestModel,
  UnassignWorkflowPayload,
} from './types';

export const adminApi = {
  getStats: (): Promise<ApiResponse<AdminStatsModel>> =>
    unwrap(api.get<ApiResponse<AdminStatsModel>>(apiUrl('admin', adminPaths.stats))),

  getJobRequests: (
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<JobRequestModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<JobRequestModel>>(
        apiUrl('admin', adminPaths.jobRequestsGetAll),
        params,
      ),
    ),

  getJobRequestById: (id: string): Promise<ApiResponse<JobRequestModel>> =>
    unwrap(
      api.get<ApiResponse<JobRequestModel>>(apiUrl('admin', adminPaths.jobRequestSingle(id))),
    ),

  searchInstallers: (
    payload: InstallerSearchPayload,
  ): Promise<ApiResponse<InstallerSearchResultModel[]>> =>
    unwrap(
      api.post<ApiResponse<InstallerSearchResultModel[]>>(
        apiUrl('admin', adminPaths.searchInstallers),
        payload,
        {},
        { showSuccessToast: false },
      ),
    ),

  assignInstaller: (
    jobRequestId: string,
    payload: AssignInstallerPayload,
  ): Promise<ApiResponse<AssignInstallerResultModel>> =>
    unwrap(
      api.post<ApiResponse<AssignInstallerResultModel>>(
        apiUrl('admin', adminPaths.assignInstaller(jobRequestId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  unassignWorkflow: (
    jobRequestId: string,
    payload: UnassignWorkflowPayload,
  ): Promise<ApiResponse<AssignInstallerResultModel>> =>
    unwrap(
      api.delete<ApiResponse<AssignInstallerResultModel>>(
        apiUrl('admin', adminPaths.unassignWorkflow(jobRequestId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getInstallerProfile: (installerId: string): Promise<ApiResponse<AdminInstallerProfileModel>> =>
    unwrap(
      api.get<ApiResponse<AdminInstallerProfileModel>>(
        apiUrl('admin', adminPaths.installerProfile(installerId)),
        {},
        {},
        { showSuccessToast: false },
      ),
    ),

  verifyOnProfile: (): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.get<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.verifyOnProfile),
        {},
        {},
        { showSuccessToast: false },
      ),
    ),

  ...adminCrmApi,
  ...adminFinanceApi,
  ...adminAnalyticsApi,
  ...adminRolesApi,
  ...adminOnboardingApi,
  ...adminJobRequestsApi,
  ...adminMeshGridApi,
  ...adminSiteAuditApi,
  ...adminInvoicesApi,
  ...adminNotificationsApi,
  ...adminCatalogApi,
  ...adminWorkflowsApi,
};

/** @deprecated Use adminApi */
export const adminEndpoints = adminApi;

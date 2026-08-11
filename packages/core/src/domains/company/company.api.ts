import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { companyPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import { companyFinanceApi } from './company.finance.api';
import { companyJobRequestsApi } from './company.job-requests.api';
import { companyMeshGridApi } from './company.mesh-grid.api';
import { companyMiniGridApi } from './company.mini-grid.api';
import { companyNotificationsApi } from './company.notifications.api';
import { companyProfileApi } from './company.profile.api';
import { companyProjectsApi } from './company.projects.api';
import { companyStoreFrontApi } from './company.store-front.api';
import { companyTeamApi } from './company.team.api';
import { companyWorkflowsApi } from './company.workflows.api';
import type { CompanyUpdatePayload } from './onboarding.types';
import type {
  CompanyJobRequestModel,
  CompanyProfileModel,
  CompanyUpdateUserPayload,
} from './types';

export const companyApi = {
  getCompanyProfile: (): Promise<ApiResponse<CompanyProfileModel>> =>
    unwrap(api.get<ApiResponse<CompanyProfileModel>>(apiUrl('company', companyPaths.profile))),

  /** Alias for {@link companyProfileApi.updateProfile}. */
  updateCompany: (
    payload: CompanyUpdatePayload,
  ): Promise<ApiResponse<CompanyProfileModel>> => companyProfileApi.updateProfile(payload),

  updateCompanyUser: (
    payload: CompanyUpdateUserPayload,
  ): Promise<ApiResponse<CompanyProfileModel>> =>
    unwrap(
      api.post<ApiResponse<CompanyProfileModel>>(
        apiUrl('company', companyPaths.updateUser),
        payload,
      ),
    ),

  getJobRequests: (): Promise<ApiResponse<CompanyJobRequestModel[]>> =>
    unwrap(
      api.get<ApiResponse<CompanyJobRequestModel[]>>(
        apiUrl('company', companyPaths.jobRequestsGetAll),
      ),
    ),

  getJobRequestDetails: (requestId: string): Promise<ApiResponse<CompanyJobRequestModel>> =>
    unwrap(
      api.get<ApiResponse<CompanyJobRequestModel>>(
        apiUrl('company', companyPaths.jobRequestSingle(requestId)),
      ),
    ),

  getDashboardOverview: (): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.get<ApiResponse<unknown>>(apiUrl('company', companyPaths.dashboardOverview)),
    ),

  ...companyFinanceApi,
  ...companyJobRequestsApi,
  ...companyMiniGridApi,
  ...companyMeshGridApi,
  ...companyStoreFrontApi,
  ...companyTeamApi,
  ...companyNotificationsApi,
  ...companyProfileApi,
  ...companyProjectsApi,
  ...companyWorkflowsApi,
};

/** @deprecated Use companyApi */
export const companyEndpoints = companyApi;

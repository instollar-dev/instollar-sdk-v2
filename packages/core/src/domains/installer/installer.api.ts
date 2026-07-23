import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import { installerFinanceApi } from './installer.finance.api';
import { installerAssessmentApi } from './installer.assessment.api';
import { installerJobRequestsApi } from './installer.job-requests.api';
import { installerMiniGridApi } from './installer.mini-grid.api';
import { installerProfileApi } from './installer.profile.api';
import { installerStorefrontApi } from './installer.storefront.api';
import { installerNotificationsApi } from './installer.notifications.api';
import { installerSiteAuditApi } from './installer.site-audit.api';
import { installerWorkflowsApi } from './installer.workflows.api';
import type {
  AssessmentModel,
  InstallerJobRequestModel,
  InstallerProfileBundleModel,
  InstallerProfileRecordModel,
  ToggleInstallerAvailabilityModel,
} from './types';

export const installerApi = {
  getInstallerProfile: async (): Promise<ApiResponse<InstallerProfileBundleModel>> => {
    const body = await unwrap(
      api.get<ApiResponse<InstallerProfileRecordModel>>(apiUrl('installer', installerPaths.profile)),
    );
    return {
      ...body,
      data: {
        profile: (body.data ?? {}) as InstallerProfileRecordModel,
        badges: [],
      },
    };
  },

  toggleInstallerAvailability: (): Promise<ApiResponse<ToggleInstallerAvailabilityModel>> =>
    unwrap(
      api.patch<ApiResponse<ToggleInstallerAvailabilityModel>>(
        apiUrl('installer', installerPaths.toggleAvailability),
        {},
      ),
    ),

  getJobRequests: (): Promise<ApiResponse<InstallerJobRequestModel[]>> =>
    unwrap(
      api.get<ApiResponse<InstallerJobRequestModel[]>>(
        apiUrl('installer', installerPaths.jobRequestsGetAll),
      ),
    ),

  getJobRequestDetails: (id: string): Promise<ApiResponse<InstallerJobRequestModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerJobRequestModel>>(
        apiUrl('installer', installerPaths.jobRequestView(id)),
      ),
    ),

  getDashboardOverview: (): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.get<ApiResponse<unknown>>(apiUrl('installer', installerPaths.dashboardOverview)),
    ),

  getAllAssessments: (): Promise<ApiResponse<AssessmentModel[]>> =>
    unwrap(
      api.get<ApiResponse<AssessmentModel[]>>(apiUrl('installer', installerPaths.assessmentGetAll)),
    ),

  ...installerFinanceApi,
  ...installerJobRequestsApi,
  ...installerMiniGridApi,
  ...installerAssessmentApi,
  ...installerSiteAuditApi,
  ...installerProfileApi,
  ...installerStorefrontApi,
  ...installerNotificationsApi,
  ...installerWorkflowsApi,
};

/** @deprecated Use installerApi */
export const installerEndpoints = installerApi;

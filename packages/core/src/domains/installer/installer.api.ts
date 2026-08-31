import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, PaginatedApiResponse } from '../../core/types';
import type { GuarantorFormPayload } from '../auth/types';
import { installerFinanceApi } from './installer.finance.api';
import { installerEsgApi } from './installer.esg.api';
import { installerAssessmentApi } from './installer.assessment.api';
import { installerJobRequestsApi } from './installer.job-requests.api';
import { installerMiniGridApi } from './installer.mini-grid.api';
import { installerProfileApi } from './installer.profile.api';
import { installerStorefrontApi } from './installer.storefront.api';
import { installerNotificationsApi } from './installer.notifications.api';
import { installerSiteAuditApi } from './installer.site-audit.api';
import { installerWorkflowsApi } from './installer.workflows.api';
import type { InstallerJobRequestListParams } from './job-requests.types';
import type { InstallerOnboardingUpdatePayload } from './onboarding.types';
import type {
  AssessmentModel,
  InstallerJobRequestModel,
  InstallerProfileBundleModel,
  InstallerProfileRecordModel,
  ToggleInstallerAvailabilityModel,
} from './types';
import type { CreateInstallerSosPayload } from './sos.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

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

  /** Alias for {@link installerProfileApi.updateInstallerProfile}. */
  updateInstallerOnboarding: (
    payload: InstallerOnboardingUpdatePayload,
    options?: { silent?: boolean },
  ): Promise<ApiResponse<InstallerProfileRecordModel>> =>
    installerProfileApi.updateInstallerProfile(payload, options),

  toggleInstallerAvailability: (): Promise<ApiResponse<ToggleInstallerAvailabilityModel>> =>
    unwrap(
      api.patch<ApiResponse<ToggleInstallerAvailabilityModel>>(
        apiUrl('installer', installerPaths.toggleAvailability),
        {},
      ),
    ),

  /**
   * Job request inbox and the projects list are the same endpoint — `status`
   * decides which ("PENDING"/"DECLINED" vs "ON_GOING"/"COMPLETED"/"CANCELED").
   */
  getJobRequests: (
    params?: InstallerJobRequestListParams,
  ): Promise<PaginatedApiResponse<InstallerJobRequestModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<InstallerJobRequestModel>>(
        apiUrl('installer', installerPaths.jobRequestsGetAll),
        params,
        // `requestType` repeats without brackets: requestType=a&requestType=b
        { paramsSerializer: { indexes: null } },
        silent,
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

  submitGuarantorForm: (payload: GuarantorFormPayload): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.guarantorForm),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  /** Create an installer SOS alert (`POST /sos/create`). */
  createInstallerSos: (payload: CreateInstallerSosPayload): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.sosCreate),
        payload,
        {},
        silent,
      ),
    ),

  ...installerFinanceApi,
  ...installerEsgApi,
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

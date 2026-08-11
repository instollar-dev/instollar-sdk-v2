import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { basePaths, companyPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import { normalizePhoneForApi } from '../../utils/phone';
import type { CompanyDashboardModel } from './profile.types';
import type { CompanyUpdatePayload } from './onboarding.types';
import type { CompanyProfileModel } from './types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const companyProfileApi = {
  /**
   * Update company profile / complete an onboarding step.
   * `POST` on the **company** service (`/company/update`).
   * Pass `stepDone` with the slug just completed during onboarding.
   */
  updateProfile: (
    payload: CompanyUpdatePayload,
  ): Promise<ApiResponse<CompanyProfileModel>> => {
    const body: CompanyUpdatePayload = {
      ...payload,
      ...(payload.contactPersonNumber != null
        ? {
            contactPersonNumber: normalizePhoneForApi(payload.contactPersonNumber),
          }
        : {}),
    };
    return unwrap(
      api.post<ApiResponse<CompanyProfileModel>>(
        apiUrl('company', companyPaths.update),
        body,
        {},
        { showSuccessToast: true, showErrorToast: false },
      ),
    );
  },

  getDashboard: (): Promise<ApiResponse<CompanyDashboardModel>> =>
    unwrap(
      api.get<ApiResponse<CompanyDashboardModel>>(
        apiUrl('base', basePaths.companyDashboard),
        {},
        {},
        silent,
      ),
    ),
};

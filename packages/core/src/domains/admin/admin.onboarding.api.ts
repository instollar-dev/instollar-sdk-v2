import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  AssignAdminToCompanyPayload,
  CompanyModel,
  OnboardedAdminsListModel,
  OnboardedCompaniesListModel,
} from './onboarding.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminOnboardingApi = {
  getOnboardedAdmins: (
    params?: Record<string, unknown>,
  ): Promise<OnboardedAdminsListModel> =>
    unwrap(
      api.get<OnboardedAdminsListModel>(
        apiUrl('admin', adminPaths.getOnboardedAdmins),
        params,
        {},
        silent,
      ),
    ),

  getOnboardedCompanies: (
    params?: Record<string, unknown>,
  ): Promise<OnboardedCompaniesListModel> =>
    unwrap(
      api.get<OnboardedCompaniesListModel>(
        apiUrl('admin', adminPaths.getOnboardedCompanies),
        params,
        {},
        silent,
      ),
    ),

  assignAdminToCompany: (
    payload: AssignAdminToCompanyPayload,
  ): Promise<ApiResponse<CompanyModel>> =>
    unwrap(
      api.patch<ApiResponse<CompanyModel>>(
        apiUrl('admin', adminPaths.assignAdminToCompany),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};

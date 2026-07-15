import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { basePaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type { CompanyDashboardModel, CompanyUpdateProfilePayload } from './profile.types';
import type { CompanyProfileModel } from './types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const companyProfileApi = {
  updateProfile: (
    payload: CompanyUpdateProfilePayload,
  ): Promise<ApiResponse<CompanyProfileModel>> =>
    unwrap(
      api.patch<ApiResponse<CompanyProfileModel>>(
        apiUrl('base', basePaths.companyUpdate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

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

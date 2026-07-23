import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { companyPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, PaginatedApiResponse } from '../../core/types';
import type { AdminNotificationModel, CompanyNotificationItemModel } from './notifications.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const companyNotificationsApi = {
  getRecentActivities: (
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<CompanyNotificationItemModel[]>> =>
    unwrap(
      api.get<ApiResponse<CompanyNotificationItemModel[]>>(
        apiUrl('company', companyPaths.notifications),
        params,
        {},
        silent,
      ),
    ),

  markNotificationRead: (id: string): Promise<ApiResponse<AdminNotificationModel>> =>
    unwrap(
      api.patch<ApiResponse<AdminNotificationModel>>(
        apiUrl('company', companyPaths.notificationRead(id)),
        {},
        {},
        silent,
      ),
    ),
};

export type CompanyNotificationsListModel =
  | ApiResponse<CompanyNotificationItemModel[]>
  | PaginatedApiResponse<AdminNotificationModel>;

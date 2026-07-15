import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type { AdminNotificationModel } from '../company/notifications.types';
import type { InstallerNotificationItemModel } from './notifications.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const installerNotificationsApi = {
  getRecentActivities: (
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<InstallerNotificationItemModel[]>> =>
    unwrap(
      api.get<ApiResponse<InstallerNotificationItemModel[]>>(
        apiUrl('installer', installerPaths.notifications),
        params,
        {},
        silent,
      ),
    ),

  markNotificationRead: (id: string): Promise<ApiResponse<AdminNotificationModel>> =>
    unwrap(
      api.patch<ApiResponse<AdminNotificationModel>>(
        apiUrl('installer', installerPaths.notificationRead(id)),
        {},
        {},
        silent,
      ),
    ),
};

import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type { AdminNotificationModel } from '../company/notifications.types';
import type { AdminNotificationsListModel } from './notifications.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminNotificationsApi = {
  getNotifications: (
    params?: Record<string, unknown>,
  ): Promise<AdminNotificationsListModel> =>
    unwrap(
      api.get<AdminNotificationsListModel>(
        apiUrl('admin', adminPaths.notifications),
        params,
        {},
        silent,
      ),
    ),

  markNotificationRead: (id: string): Promise<ApiResponse<AdminNotificationModel>> =>
    unwrap(
      api.patch<ApiResponse<AdminNotificationModel>>(
        apiUrl('admin', adminPaths.notificationRead(id)),
        {},
        {},
        silent,
      ),
    ),

  markAllNotificationsRead: (
    params: { total?: number; search?: string } = {},
  ): Promise<AdminNotificationsListModel> => {
    const { total = 0, search } = params;
    if (total <= 0) {
      return Promise.resolve({
        success: true,
        message: 'No notifications to mark as read',
        data: [],
        pagination: { page: 1, limit: 1, total: 0, totalPages: 0 },
      } as AdminNotificationsListModel);
    }

    const query: Record<string, string | number | boolean> = {
      page: 1,
      limit: total,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      markAsRead: true,
    };
    if (search?.trim()) query.search = search.trim();

    return unwrap(
      api.get<AdminNotificationsListModel>(
        apiUrl('admin', adminPaths.notifications),
        query,
        {},
        { showSuccessToast: true, showErrorToast: true },
      ),
    );
  },
};

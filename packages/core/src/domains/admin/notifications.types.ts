import type { PaginatedApiResponse } from '../../core/types';

import type { AdminNotificationModel } from '../company/notifications.types';

export type AdminNotificationsListModel = PaginatedApiResponse<AdminNotificationModel>;

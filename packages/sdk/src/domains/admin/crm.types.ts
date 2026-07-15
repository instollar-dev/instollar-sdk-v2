import type { PaginatedApiResponse } from '../../core/types';

import type { AdminUserModel } from './types';

export interface PaginatedListModel<T> {
  content?: T[];
  data?: T[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  [key: string]: unknown;
}

export interface CreateAdminUserPayload {
  [key: string]: unknown;
}

export interface UpdateAdminUserPayload {
  [key: string]: unknown;
}

export interface AdminCompanyUserProfileModel {
  id: string;
  [key: string]: unknown;
}

export interface AdminEndUserModel {
  id: string;
  [key: string]: unknown;
}

export interface AdminInstallerJobModel {
  id: string;
  [key: string]: unknown;
}

export interface UpdateAdminInstallerPayload {
  level?: string;
  [key: string]: unknown;
}

export interface UpdateAdminCompanyPayload {
  [key: string]: unknown;
}

export interface AdminProfileModel {
  id: string;
  [key: string]: unknown;
}

export type AdminUserListModel = PaginatedListModel<AdminUserModel>;
export type AdminUserJobsListModel = PaginatedApiResponse<AdminInstallerJobModel>;

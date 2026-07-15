import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  AdminCompanyUserProfileModel,
  AdminEndUserModel,
  AdminProfileModel,
  AdminUserJobsListModel,
  AdminUserListModel,
  CreateAdminUserPayload,
  UpdateAdminCompanyPayload,
  UpdateAdminInstallerPayload,
  UpdateAdminUserPayload,
} from './crm.types';
import type { AdminUserModel } from './types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminCrmApi = {
  getUsers: (params?: Record<string, unknown>): Promise<ApiResponse<AdminUserListModel>> =>
    unwrap(
      api.get<ApiResponse<AdminUserListModel>>(
        apiUrl('base', adminPaths.getUsers),
        params,
        {},
        silent,
      ),
    ),

  getAllCompanyUsers: (
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<AdminUserListModel>> =>
    unwrap(
      api.get<ApiResponse<AdminUserListModel>>(
        apiUrl('base', adminPaths.getAllCompanyUsers),
        params,
        {},
        silent,
      ),
    ),

  createUser: (payload: CreateAdminUserPayload): Promise<ApiResponse<AdminUserModel>> =>
    unwrap(
      api.post<ApiResponse<AdminUserModel>>(
        apiUrl('base', adminPaths.createUser),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateUser: (
    id: string,
    payload: UpdateAdminUserPayload,
  ): Promise<ApiResponse<AdminUserModel>> =>
    unwrap(
      api.patch<ApiResponse<AdminUserModel>>(
        apiUrl('base', adminPaths.updateUser(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteUser: (id: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.delete<ApiResponse<null>>(
        apiUrl('base', adminPaths.deleteUser(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  updateInstaller: (
    id: string,
    payload: UpdateAdminInstallerPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.patch<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.updateInstaller(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getUserJobs: (
    id: string,
    userType: 'INSTALLER' | 'COMPANY',
    params?: Record<string, unknown>,
  ): Promise<AdminUserJobsListModel> =>
    unwrap(
      api.get<AdminUserJobsListModel>(
        apiUrl('admin', adminPaths.userJobs(id, userType)),
        params,
        {},
        { showErrorToast: true, showSuccessToast: false },
      ),
    ),

  getUserProfile: (
    id: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<AdminUserModel | AdminCompanyUserProfileModel>> =>
    unwrap(
      api.get<ApiResponse<AdminUserModel | AdminCompanyUserProfileModel>>(
        apiUrl('admin', adminPaths.getUserProfile(id)),
        params,
        {},
        silent,
      ),
    ),

  getEndUsers: (params?: Record<string, unknown>): Promise<ApiResponse<AdminEndUserModel[]>> =>
    unwrap(
      api.get<ApiResponse<AdminEndUserModel[]>>(
        apiUrl('admin', adminPaths.crmEndUsers),
        params,
        {},
        { showErrorToast: true, showSuccessToast: false },
      ),
    ),

  updateCompany: (
    id: string,
    payload: UpdateAdminCompanyPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.patch<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.updateCompany(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getAdminProfile: (): Promise<ApiResponse<AdminProfileModel>> =>
    unwrap(api.get<ApiResponse<AdminProfileModel>>(apiUrl('admin', adminPaths.profile))),

  updateAdminProfile: (payload: Record<string, unknown>): Promise<ApiResponse<AdminProfileModel>> =>
    unwrap(
      api.patch<ApiResponse<AdminProfileModel>>(
        apiUrl('admin', adminPaths.updateProfile),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  sendProfileCompletionReminder: (
    userId: string,
    userType: string,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.crmCompleteProfileReminder(userId, userType)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),
};

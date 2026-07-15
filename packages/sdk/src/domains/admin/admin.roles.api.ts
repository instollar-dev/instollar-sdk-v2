import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  CreateRolePayload,
  PermissionListModel,
  RoleListModel,
  RoleModel,
  UpdateRolePayload,
} from './roles.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminRolesApi = {
  getPermissions: (
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<PermissionListModel>> =>
    unwrap(
      api.get<ApiResponse<PermissionListModel>>(
        apiUrl('admin', adminPaths.permissions),
        params,
        {},
        silent,
      ),
    ),

  getRoles: (params?: Record<string, unknown>): Promise<ApiResponse<RoleListModel>> =>
    unwrap(
      api.get<ApiResponse<RoleListModel>>(
        apiUrl('admin', adminPaths.rolesGetAll),
        params,
        {},
        silent,
      ),
    ),

  getRoleById: (id: string): Promise<ApiResponse<RoleModel>> =>
    unwrap(
      api.get<ApiResponse<RoleModel>>(
        apiUrl('admin', adminPaths.roleSingle(id)),
        {},
        {},
        silent,
      ),
    ),

  createRole: (payload: CreateRolePayload): Promise<ApiResponse<RoleModel>> =>
    unwrap(
      api.post<ApiResponse<RoleModel>>(
        apiUrl('admin', adminPaths.roleCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateRole: (id: string, payload: UpdateRolePayload): Promise<ApiResponse<RoleModel>> =>
    unwrap(
      api.put<ApiResponse<RoleModel>>(
        apiUrl('admin', adminPaths.roleUpdate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteRole: (id: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.delete<ApiResponse<null>>(
        apiUrl('admin', adminPaths.roleDelete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),
};

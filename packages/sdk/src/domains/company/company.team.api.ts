import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths, companyPaths, userPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  CompanyInstallerModel,
  CompanyPermissionModel,
  CompanyRoleListModel,
  CompanyRoleModel,
  CompanyTeamMemberDetailModel,
  CompanyTeamMemberModel,
  CreateCompanyRolePayload,
  CreateCompanyTeamMemberPayload,
  UpdateCompanyRolePayload,
  UpdateCompanyTeamMemberPayload,
} from './team.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const companyTeamApi = {
  getCompanyTeamMembers: (
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<CompanyTeamMemberModel[]>> =>
    unwrap(
      api.get<ApiResponse<CompanyTeamMemberModel[]>>(
        apiUrl('base', userPaths.getAll),
        params,
        {},
        silent,
      ),
    ),

  getCompanyTeamMemberDetails: (
    userId: string,
  ): Promise<ApiResponse<CompanyTeamMemberDetailModel>> =>
    unwrap(
      api.get<ApiResponse<CompanyTeamMemberDetailModel>>(
        apiUrl('admin', adminPaths.getUserProfile(userId)),
        {},
        {},
        silent,
      ),
    ),

  createCompanyTeamMember: (
    payload: CreateCompanyTeamMemberPayload,
  ): Promise<ApiResponse<CompanyTeamMemberModel>> =>
    unwrap(
      api.post<ApiResponse<CompanyTeamMemberModel>>(
        apiUrl('base', userPaths.create),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateCompanyTeamMember: (
    id: string,
    payload: UpdateCompanyTeamMemberPayload,
  ): Promise<ApiResponse<CompanyTeamMemberModel>> =>
    unwrap(
      api.patch<ApiResponse<CompanyTeamMemberModel>>(
        apiUrl('base', userPaths.update(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteCompanyTeamMember: (id: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.delete<ApiResponse<null>>(
        apiUrl('base', userPaths.delete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  getCompanyPermissions: (): Promise<ApiResponse<CompanyPermissionModel[]>> =>
    unwrap(
      api.get<ApiResponse<CompanyPermissionModel[]>>(
        apiUrl('company', companyPaths.rolePermissions),
        {},
        {},
        silent,
      ),
    ),

  getCompanyRoles: (
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<CompanyRoleListModel>> =>
    unwrap(
      api.get<ApiResponse<CompanyRoleListModel>>(
        apiUrl('company', companyPaths.rolesGetAll),
        params,
        {},
        silent,
      ),
    ),

  createCompanyRole: (
    payload: CreateCompanyRolePayload,
  ): Promise<ApiResponse<CompanyRoleModel>> =>
    unwrap(
      api.post<ApiResponse<CompanyRoleModel>>(
        apiUrl('company', companyPaths.roleCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateCompanyRole: (
    id: string,
    payload: UpdateCompanyRolePayload,
  ): Promise<ApiResponse<CompanyRoleModel>> =>
    unwrap(
      api.put<ApiResponse<CompanyRoleModel>>(
        apiUrl('company', companyPaths.roleUpdate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteCompanyRole: (id: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.delete<ApiResponse<null>>(
        apiUrl('company', companyPaths.roleDelete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  getCompanyInstallers: (): Promise<ApiResponse<CompanyInstallerModel[]>> =>
    unwrap(
      api.get<ApiResponse<CompanyInstallerModel[]>>(
        apiUrl('company', companyPaths.miniGridGetAllInstallers),
        {},
        {},
        silent,
      ),
    ),
};

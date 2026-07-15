import type { PaginatedListModel } from './crm.types';

export interface PermissionModel {
  id: string;
  [key: string]: unknown;
}

export interface RoleModel {
  id: string;
  [key: string]: unknown;
}

export interface CreateRolePayload {
  [key: string]: unknown;
}

export interface UpdateRolePayload {
  [key: string]: unknown;
}

export type PermissionListModel = PaginatedListModel<PermissionModel>;
export type RoleListModel = PaginatedListModel<RoleModel>;

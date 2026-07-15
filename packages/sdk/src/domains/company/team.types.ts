import type { PaginatedListModel } from '../admin/crm.types';

export interface CompanyTeamMemberModel {
  id: string;
  [key: string]: unknown;
}

export interface CompanyTeamMemberDetailModel {
  id: string;
  [key: string]: unknown;
}

export interface CompanyPermissionModel {
  id: string;
  [key: string]: unknown;
}

export interface CompanyRoleModel {
  id: string;
  [key: string]: unknown;
}

export interface CompanyInstallerModel {
  id: string;
  [key: string]: unknown;
}

export interface CreateCompanyTeamMemberPayload {
  [key: string]: unknown;
}

export interface UpdateCompanyTeamMemberPayload {
  [key: string]: unknown;
}

export interface CreateCompanyRolePayload {
  [key: string]: unknown;
}

export interface UpdateCompanyRolePayload {
  [key: string]: unknown;
}

export type CompanyRoleListModel = PaginatedListModel<CompanyRoleModel>;

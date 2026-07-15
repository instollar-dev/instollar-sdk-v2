import type { PaginatedApiResponse } from '../../core/types';

import type { AdminUserModel } from './types';

export interface CompanyModel {
  id: string;
  [key: string]: unknown;
}

export interface AssignAdminToCompanyPayload {
  [key: string]: unknown;
}

export type OnboardedAdminsListModel = PaginatedApiResponse<AdminUserModel>;
export type OnboardedCompaniesListModel = PaginatedApiResponse<CompanyModel>;

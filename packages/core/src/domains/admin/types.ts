export interface AdminStatsModel {
  totalUsers: number;
  activeProjects: number;
  revenue: number;
}

export interface AdminUserModel {
  id: string;
  [key: string]: unknown;
}

export interface JobRequestModel {
  id: string;
  [key: string]: unknown;
}

export interface InstallerSearchPayload {
  [key: string]: unknown;
}

export interface InstallerSearchResultModel {
  installerId: string;
  [key: string]: unknown;
}

export interface AdminInstallerProfileModel {
  installerId: string;
  [key: string]: unknown;
}

export interface AssignInstallerPayload {
  installerId: string;
  [key: string]: unknown;
}

export interface AssignInstallerResultModel {
  [key: string]: unknown;
}

export interface UnassignWorkflowPayload {
  [key: string]: unknown;
}

/** @deprecated Use AdminStatsModel */
export type AdminStats = AdminStatsModel;
/** @deprecated Use AdminUserModel */
export type AdminUser = AdminUserModel;
/** @deprecated Use JobRequestModel */
export type JobRequest = JobRequestModel;
/** @deprecated Use InstallerSearchResultModel */
export type InstallerSearchResult = InstallerSearchResultModel;
/** @deprecated Use AdminInstallerProfileModel */
export type InstallerProfile = AdminInstallerProfileModel;
/** @deprecated Use AssignInstallerResultModel */
export type AssignInstallerResult = AssignInstallerResultModel;

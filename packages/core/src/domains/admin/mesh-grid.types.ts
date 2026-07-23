import type { PaginatedApiResponse } from '../../core/types';

import type { JobRequestModel } from './types';

export interface MeshGridProjectModel {
  id: string;
  [key: string]: unknown;
}

export interface AdminMeshGridReportModel {
  id: string;
  [key: string]: unknown;
}

export interface AdminMeshGridWorkflowModel {
  id: string;
  [key: string]: unknown;
}

export interface AssignMeshGridWorkflowsPayload {
  [key: string]: unknown;
}

export interface AssignMeshGridInstallersPayload {
  [key: string]: unknown;
}

export interface UpdateMeshGridReportPayload {
  [key: string]: unknown;
}

export interface AssignMiniGridInstallersPayload {
  [key: string]: unknown;
}

export interface UnassignMiniGridInstallersPayload {
  [key: string]: unknown;
}

export type MeshGridProjectListModel = PaginatedApiResponse<MeshGridProjectModel>;
export type MiniGridListModel = PaginatedApiResponse<JobRequestModel>;
export type MiniGridCompanyInstallersListModel = PaginatedApiResponse<unknown>;
export type MeshGridReportListModel = PaginatedApiResponse<AdminMeshGridReportModel>;

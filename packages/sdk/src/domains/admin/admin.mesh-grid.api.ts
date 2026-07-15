import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  AdminMeshGridWorkflowModel,
  AssignMeshGridInstallersPayload,
  AssignMeshGridWorkflowsPayload,
  AssignMiniGridInstallersPayload,
  MeshGridProjectListModel,
  MeshGridProjectModel,
  MeshGridReportListModel,
  MiniGridCompanyInstallersListModel,
  MiniGridListModel,
  UnassignMiniGridInstallersPayload,
  UpdateMeshGridReportPayload,
} from './mesh-grid.types';
import type { JobRequestModel } from './types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminMeshGridApi = {
  getMeshGrids: (params?: Record<string, unknown>): Promise<MeshGridProjectListModel> =>
    unwrap(
      api.get<MeshGridProjectListModel>(
        apiUrl('admin', adminPaths.meshGridGetAll),
        params,
        {},
        silent,
      ),
    ),

  getMeshGridById: (id: string): Promise<ApiResponse<MeshGridProjectModel>> =>
    unwrap(
      api.get<ApiResponse<MeshGridProjectModel>>(
        apiUrl('admin', adminPaths.meshGridSingle(id)),
        {},
        {},
        silent,
      ),
    ),

  assignWorkflows: (
    id: string,
    payload: AssignMeshGridWorkflowsPayload,
  ): Promise<ApiResponse<MeshGridProjectModel>> =>
    unwrap(
      api.post<ApiResponse<MeshGridProjectModel>>(
        apiUrl('admin', adminPaths.meshGridAssignWorkflows(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  assignInstallers: (
    id: string,
    payload: AssignMeshGridInstallersPayload,
  ): Promise<ApiResponse<MeshGridProjectModel>> =>
    unwrap(
      api.post<ApiResponse<MeshGridProjectModel>>(
        apiUrl('admin', adminPaths.meshGridAssign(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getMeshGridReports: (
    jobId: string,
    params?: Record<string, unknown>,
  ): Promise<MeshGridReportListModel> =>
    unwrap(
      api.get<MeshGridReportListModel>(
        apiUrl('admin', adminPaths.meshGridReports(jobId)),
        params,
        {},
        silent,
      ),
    ),

  getMeshGridReportWorkflow: (
    jobId: string,
    workflowId: string,
  ): Promise<ApiResponse<AdminMeshGridWorkflowModel>> =>
    unwrap(
      api.get<ApiResponse<AdminMeshGridWorkflowModel>>(
        apiUrl('admin', adminPaths.meshGridReportWorkflow(jobId, workflowId)),
        {},
        {},
        silent,
      ),
    ),

  updateMeshGridReport: (
    reportId: string,
    payload: UpdateMeshGridReportPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.patch<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.meshGridUpdateReport(reportId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getMiniGrids: (params?: Record<string, unknown>): Promise<MiniGridListModel> =>
    unwrap(
      api.get<MiniGridListModel>(
        apiUrl('admin', adminPaths.miniGridGetAll),
        params,
        {},
        silent,
      ),
    ),

  getMiniGridById: (id: string): Promise<ApiResponse<JobRequestModel>> =>
    unwrap(
      api.get<ApiResponse<JobRequestModel>>(
        apiUrl('admin', adminPaths.miniGridSingle(id)),
        {},
        {},
        silent,
      ),
    ),

  getMiniGridCompanyInstallers: (
    companyId: string,
    params?: Record<string, unknown>,
  ): Promise<MiniGridCompanyInstallersListModel> =>
    unwrap(
      api.get<MiniGridCompanyInstallersListModel>(
        apiUrl('admin', adminPaths.miniGridCompanyInstallers(companyId)),
        params,
        {},
        silent,
      ),
    ),

  assignInstallersToCompany: (
    payload: AssignMiniGridInstallersPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.patch<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.miniGridAssignInstallersToCompany),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  unassignInstallersFromCompany: (
    payload: UnassignMiniGridInstallersPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.patch<ApiResponse<unknown>>(
        apiUrl('admin', adminPaths.miniGridUnassignInstallersFromCompany),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};

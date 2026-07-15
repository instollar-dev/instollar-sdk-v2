import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { basePaths, installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, PaginatedApiResponse } from '../../core/types';
import type {
  CommissionMeshGridReportPayload,
  CreateMeshGridReportPayload,
  GenerateOfflineSlotsPayload,
  InstallerMeshGridProjectModel,
  InterestDataModel,
  MeshGridPersonalSummaryModel,
  StoreFrontOverviewStatsModel,
  SubmitToolboxBriefPayload,
  SyncOfflineReportPayload,
  ToolboxSubmissionModel,
  ToolboxTemplateModel,
  WorkflowActivityModel,
} from './storefront.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const installerStorefrontApi = {
  getStoreFrontOverview: (): Promise<ApiResponse<StoreFrontOverviewStatsModel>> =>
    unwrap(
      api.get<ApiResponse<StoreFrontOverviewStatsModel>>(
        apiUrl('base', basePaths.installerStoreFrontOverview),
        {},
        {},
        silent,
      ),
    ),

  getStoreFrontInterests: (): Promise<ApiResponse<InterestDataModel[]>> =>
    unwrap(
      api.get<ApiResponse<InterestDataModel[]>>(
        apiUrl('base', basePaths.installerStoreFrontInterests),
        {},
        {},
        silent,
      ),
    ),

  getStoreFrontProducts: (): Promise<ApiResponse<unknown[]>> =>
    unwrap(
      api.get<ApiResponse<unknown[]>>(
        apiUrl('base', basePaths.installerStoreFrontProducts),
        {},
        {},
        silent,
      ),
    ),

  getMeshGrids: (
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<InstallerMeshGridProjectModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<InstallerMeshGridProjectModel>>(
        apiUrl('installer', installerPaths.meshGridGetAll),
        params,
        {},
        silent,
      ),
    ),

  getMeshGridById: (id: string): Promise<ApiResponse<InstallerMeshGridProjectModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerMeshGridProjectModel>>(
        apiUrl('installer', installerPaths.meshGridSingle(id)),
        {},
        {},
        silent,
      ),
    ),

  createMeshGridReport: (
    payload: CreateMeshGridReportPayload,
  ): Promise<ApiResponse<WorkflowActivityModel>> =>
    unwrap(
      api.post<ApiResponse<WorkflowActivityModel>>(
        apiUrl('installer', installerPaths.meshGridReportCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getMeshGridPersonalSummary: (
    jobId: string,
  ): Promise<ApiResponse<MeshGridPersonalSummaryModel>> =>
    unwrap(
      api.get<ApiResponse<MeshGridPersonalSummaryModel>>(
        apiUrl('installer', installerPaths.meshGridPersonalSummary(jobId)),
        {},
        {},
        silent,
      ),
    ),

  getMeshGridProjectActivity: (
    jobId: string,
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<WorkflowActivityModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<WorkflowActivityModel>>(
        apiUrl('installer', installerPaths.meshGridProjectActivity(jobId)),
        params,
        {},
        silent,
      ),
    ),

  commissionMeshGridReport: (
    reportId: string,
    payload: CommissionMeshGridReportPayload,
  ): Promise<ApiResponse<WorkflowActivityModel>> =>
    unwrap(
      api.post<ApiResponse<WorkflowActivityModel>>(
        apiUrl('installer', installerPaths.meshGridReportCommission(reportId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  generateOfflineSlots: (
    payload: GenerateOfflineSlotsPayload,
  ): Promise<ApiResponse<string[]>> =>
    unwrap(
      api.post<ApiResponse<string[]>>(
        apiUrl('installer', installerPaths.meshGridOfflineGenerateSlots),
        payload,
        {},
        silent,
      ),
    ),

  syncOfflineReport: (
    payload: SyncOfflineReportPayload,
  ): Promise<ApiResponse<WorkflowActivityModel>> =>
    unwrap(
      api.patch<ApiResponse<WorkflowActivityModel>>(
        apiUrl('installer', installerPaths.meshGridOfflineSync),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getActiveToolboxTemplates: (
    jobId: string,
  ): Promise<ApiResponse<ToolboxTemplateModel[]>> =>
    unwrap(
      api.get<ApiResponse<ToolboxTemplateModel[]>>(
        apiUrl('installer', installerPaths.toolboxActiveTemplates(jobId)),
        {},
        {},
        silent,
      ),
    ),

  submitToolboxBrief: (
    jobId: string,
    payload: SubmitToolboxBriefPayload,
  ): Promise<ApiResponse<ToolboxSubmissionModel>> =>
    unwrap(
      api.post<ApiResponse<ToolboxSubmissionModel>>(
        apiUrl('installer', installerPaths.toolboxSubmitBrief(jobId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getMyToolboxSubmissions: (
    jobId: string,
    params?: Record<string, unknown>,
  ): Promise<PaginatedApiResponse<ToolboxSubmissionModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<ToolboxSubmissionModel>>(
        apiUrl('installer', installerPaths.toolboxMySubmissions(jobId)),
        params,
        {},
        silent,
      ),
    ),
};

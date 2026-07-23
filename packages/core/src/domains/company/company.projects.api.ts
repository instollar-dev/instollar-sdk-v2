import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { basePaths, companyPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  ApproveOrRejectProjectBoqPayload,
  LocationReportModel,
  ProjectActionResultModel,
  ProjectDetailApiPayloadModel,
  ProjectListApiRowModel,
  ProjectReportDetailModel,
  ProjectWorkflowReportRowModel,
  SubmitInstallerRatingPayload,
} from './projects.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const companyProjectsApi = {
  getProjects: (): Promise<ApiResponse<ProjectListApiRowModel[]>> =>
    unwrap(
      api.get<ApiResponse<ProjectListApiRowModel[]>>(
        apiUrl('company', companyPaths.jobRequestsGetAll),
        {},
        {},
        silent,
      ),
    ),

  getProjectDetails: (projectId: string): Promise<ApiResponse<ProjectDetailApiPayloadModel>> =>
    unwrap(
      api.get<ApiResponse<ProjectDetailApiPayloadModel>>(
        apiUrl('company', companyPaths.jobRequestSingle(projectId)),
        {},
        {},
        silent,
      ),
    ),

  getLocationReport: (projectId: string): Promise<ApiResponse<LocationReportModel>> =>
    unwrap(
      api.get<ApiResponse<LocationReportModel>>(
        apiUrl('base', basePaths.projectLocationReport(projectId)),
        {},
        {},
        silent,
      ),
    ),

  getProjectReportDetail: (
    projectId: string,
  ): Promise<ApiResponse<ProjectReportDetailModel>> =>
    unwrap(
      api.get<ApiResponse<ProjectReportDetailModel>>(
        apiUrl('base', basePaths.projectReport(projectId)),
        {},
        {},
        silent,
      ),
    ),

  getProjectWorkflowReports: (
    projectId: string,
  ): Promise<ApiResponse<ProjectWorkflowReportRowModel[]>> =>
    unwrap(
      api.get<ApiResponse<ProjectWorkflowReportRowModel[]>>(
        apiUrl('company', companyPaths.projectWorkflowReports(projectId)),
        {},
        {},
        silent,
      ),
    ),

  approveOrRejectProjectBoq: (
    requestId: string,
    payload: ApproveOrRejectProjectBoqPayload,
  ): Promise<ApiResponse<ProjectActionResultModel>> =>
    unwrap(
      api.patch<ApiResponse<ProjectActionResultModel>>(
        apiUrl('company', companyPaths.jobRequestApprove(requestId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  completeOrCancelProject: (
    requestId: string,
    decision: string,
    payload?: Record<string, unknown>,
  ): Promise<ApiResponse<ProjectActionResultModel>> =>
    unwrap(
      api.patch<ApiResponse<ProjectActionResultModel>>(
        apiUrl('company', companyPaths.jobRequestCompleteCancel(requestId, decision)),
        payload ?? {},
        {},
        { showSuccessToast: true },
      ),
    ),

  submitInstallerRating: (
    payload: SubmitInstallerRatingPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('company', companyPaths.submitInstallerRating),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};

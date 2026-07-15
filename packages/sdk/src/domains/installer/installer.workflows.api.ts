import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths, sharedPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, PaginatedApiResponse } from '../../core/types';
import type {
  InstallerProjectWorkflowsParams,
  InstallerStepChatHistoryParams,
  InstallerStepChatsParams,
  InstallerWorkflowRowModel,
  InstallerWorkflowSingleModel,
  WorkflowContentStepSubmitPayload,
  WorkflowStepChatModel,
} from './workflow.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const installerWorkflowsApi = {
  getInstallerProjectWorkflows: (
    projectId: string,
    params?: InstallerProjectWorkflowsParams,
  ): Promise<ApiResponse<InstallerWorkflowRowModel[]>> =>
    unwrap(
      api.get<ApiResponse<InstallerWorkflowRowModel[]>>(
        apiUrl('installer', installerPaths.workflowGetAll(projectId)),
        params,
        {},
        silent,
      ),
    ),

  getInstallerWorkflowSingle: (
    projectId: string,
    workflowId: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<InstallerWorkflowSingleModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerWorkflowSingleModel>>(
        apiUrl('installer', installerPaths.workflowSingle(projectId, workflowId)),
        params,
        {},
        silent,
      ),
    ),

  submitWorkflowContentStep: (
    jobId: string,
    payload: WorkflowContentStepSubmitPayload,
  ): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.workflowSubmit(jobId)),
        payload,
        {},
        silent,
      ),
    ),

  acceptWorkflowPrecautions: (requestId: string): Promise<ApiResponse<unknown>> =>
    unwrap(
      api.post<ApiResponse<unknown>>(
        apiUrl('installer', installerPaths.jobRequestAcceptPrecautions(requestId)),
        {},
        {},
        silent,
      ),
    ),

  getStepChats: async (
    stepId: string,
    params?: InstallerStepChatsParams,
  ): Promise<ApiResponse<WorkflowStepChatModel[]>> => {
    try {
      return await unwrap(
        api.get<ApiResponse<WorkflowStepChatModel[]>>(
          apiUrl('installer', installerPaths.workflowStepChats(stepId)),
          params,
          {},
          silent,
        ),
      );
    } catch {
      return unwrap(
        api.get<ApiResponse<WorkflowStepChatModel[]>>(
          apiUrl('installer', installerPaths.workflowsStepChats(stepId)),
          params,
          {},
          silent,
        ),
      );
    }
  },

  getStepChatHistory: (
    params: InstallerStepChatHistoryParams,
  ): Promise<PaginatedApiResponse<WorkflowStepChatModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<WorkflowStepChatModel>>(
        apiUrl('installer', sharedPaths.chatHistoryStep),
        params,
        {},
        silent,
      ),
    ),
};

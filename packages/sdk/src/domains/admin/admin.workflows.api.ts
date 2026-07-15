import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths, sharedPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse, PaginatedApiResponse } from '../../core/types';
import type {
  AdminStepChatHistoryParams,
  AdminStepChatsParams,
  AdminWorkflowModel,
  AdminWorkflowStepChatModel,
  AdminWorkflowsListParams,
  CreateAdminWorkflowPayload,
  DuplicateAdminWorkflowPayload,
  UpdateAdminWorkflowPayload,
} from './workflow.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const adminWorkflowsApi = {
  getWorkflows: (
    params?: AdminWorkflowsListParams,
  ): Promise<ApiResponse<AdminWorkflowModel[]>> =>
    unwrap(
      api.get<ApiResponse<AdminWorkflowModel[]>>(
        apiUrl('admin', adminPaths.workflowsGetAll),
        params,
        {},
        silent,
      ),
    ),

  getWorkflowById: (
    id: string,
    params?: Record<string, unknown>,
  ): Promise<ApiResponse<AdminWorkflowModel>> =>
    unwrap(
      api.get<ApiResponse<AdminWorkflowModel>>(
        apiUrl('admin', adminPaths.workflowSingle(id)),
        params,
        {},
        silent,
      ),
    ),

  createWorkflow: (
    payload: CreateAdminWorkflowPayload,
  ): Promise<ApiResponse<AdminWorkflowModel>> =>
    unwrap(
      api.post<ApiResponse<AdminWorkflowModel>>(
        apiUrl('admin', adminPaths.workflowCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateWorkflow: (
    id: string,
    payload: UpdateAdminWorkflowPayload,
  ): Promise<ApiResponse<AdminWorkflowModel>> =>
    unwrap(
      api.patch<ApiResponse<AdminWorkflowModel>>(
        apiUrl('admin', adminPaths.workflowUpdate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getWorkflowsByCompany: (companyId: string): Promise<ApiResponse<AdminWorkflowModel[]>> =>
    unwrap(
      api.get<ApiResponse<AdminWorkflowModel[]>>(
        apiUrl('admin', adminPaths.workflowsByCompany(companyId)),
        {},
        {},
        silent,
      ),
    ),

  duplicateWorkflow: (
    id: string,
    payload: DuplicateAdminWorkflowPayload,
  ): Promise<ApiResponse<AdminWorkflowModel>> =>
    unwrap(
      api.post<ApiResponse<AdminWorkflowModel>>(
        apiUrl('admin', adminPaths.workflowDuplicate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteWorkflow: (id: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.delete<ApiResponse<null>>(
        apiUrl('admin', adminPaths.workflowDelete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  getStepChats: (
    stepId: string,
    params?: AdminStepChatsParams,
  ): Promise<ApiResponse<AdminWorkflowStepChatModel[]>> =>
    unwrap(
      api.get<ApiResponse<AdminWorkflowStepChatModel[]>>(
        apiUrl('admin', adminPaths.workflowStepChats(stepId)),
        params,
        {},
        silent,
      ),
    ),

  getStepChatHistory: (
    params: AdminStepChatHistoryParams,
  ): Promise<PaginatedApiResponse<AdminWorkflowStepChatModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<AdminWorkflowStepChatModel>>(
        apiUrl('admin', sharedPaths.chatHistoryStep),
        params,
        {},
        silent,
      ),
    ),
};

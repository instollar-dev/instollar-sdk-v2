import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { companyPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  CreateWorkflowModel,
  CreateWorkflowPayload,
  UpdateWorkflowPayload,
  WorkflowDetailModel,
  WorkflowItemModel,
  WorkflowsListParams,
} from './workflow.types';

const silent = { showSuccessToast: false } as const;

function buildWorkflowsListUrl(params: WorkflowsListParams): string {
  const search = new URLSearchParams();
  for (const type of params.types) {
    if (type) search.append('type', type);
  }
  search.set('page', String(params.page ?? 1));
  search.set('limit', String(params.limit ?? 10));
  search.set('sortBy', params.sortBy ?? 'createdAt');
  const sortOrder = String(params.sortOrder ?? 'DESC').toUpperCase();
  search.set('sortOrder', sortOrder === 'ASC' ? 'ASC' : 'DESC');
  if (params.search) search.set('search', params.search);
  const qs = search.toString();
  return qs
    ? `${companyPaths.workflowsGetAll}?${qs}`
    : companyPaths.workflowsGetAll;
}

export const companyWorkflowsApi = {
  getWorkflows: (params: WorkflowsListParams): Promise<ApiResponse<WorkflowItemModel[]>> => {
    const types = params.types.filter(Boolean);
    if (types.length === 0) {
      return Promise.resolve({
        success: true,
        message: 'No company types configured for workflows',
        data: [],
        pagination: {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      });
    }

    return unwrap(
      api.get<ApiResponse<WorkflowItemModel[]>>(
        apiUrl('company', buildWorkflowsListUrl({ ...params, types })),
        {},
        {},
        silent,
      ),
    );
  },

  getWorkflowDetails: (workflowId: string): Promise<ApiResponse<WorkflowDetailModel>> =>
    unwrap(
      api.get<ApiResponse<WorkflowDetailModel>>(
        apiUrl('company', companyPaths.workflowSingle(workflowId)),
        {},
        {},
        silent,
      ),
    ),

  createWorkflow: (payload: CreateWorkflowPayload): Promise<ApiResponse<CreateWorkflowModel>> =>
    unwrap(
      api.post<ApiResponse<CreateWorkflowModel>>(
        apiUrl('company', companyPaths.workflowCreate),
        payload,
        {},
        silent,
      ),
    ),

  updateWorkflow: (
    workflowId: string,
    payload: UpdateWorkflowPayload,
  ): Promise<ApiResponse<CreateWorkflowModel>> =>
    unwrap(
      api.patch<ApiResponse<CreateWorkflowModel>>(
        apiUrl('company', companyPaths.workflowUpdate(workflowId)),
        payload,
        {},
        silent,
      ),
    ),
};

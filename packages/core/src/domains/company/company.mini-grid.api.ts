import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { companyPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  ClusterJobRequestItemModel,
  CreateMeshClusterModel,
  CreateMeshClusterPayload,
  CreateMiniGridJobRequestModel,
  CreateMiniGridJobRequestPayload,
  MiniGridJobRequestModel,
} from './mini-grid.types';
import type { JobRequestActionResultModel } from './job-requests.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const companyMiniGridApi = {
  getMiniGridJobRequests: (): Promise<ApiResponse<MiniGridJobRequestModel[]>> =>
    unwrap(
      api.get<ApiResponse<MiniGridJobRequestModel[]>>(
        apiUrl('company', companyPaths.miniGridGetAll),
        {},
        {},
        silent,
      ),
    ),

  getMiniGridJobRequestDetails: (
    jobId: string,
  ): Promise<ApiResponse<MiniGridJobRequestModel>> =>
    unwrap(
      api.get<ApiResponse<MiniGridJobRequestModel>>(
        apiUrl('company', companyPaths.miniGridSingle(jobId)),
        {},
        {},
        silent,
      ),
    ),

  createMiniGridJobRequest: (
    payload: CreateMiniGridJobRequestPayload,
  ): Promise<ApiResponse<CreateMiniGridJobRequestModel>> =>
    unwrap(
      api.post<ApiResponse<CreateMiniGridJobRequestModel>>(
        apiUrl('company', companyPaths.miniGridCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  deleteMiniGridJobRequest: (
    id: string,
  ): Promise<ApiResponse<JobRequestActionResultModel>> =>
    unwrap(
      api.delete<ApiResponse<JobRequestActionResultModel>>(
        apiUrl('company', companyPaths.miniGridDelete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  getClusterJobRequests: (): Promise<ApiResponse<ClusterJobRequestItemModel[]>> =>
    unwrap(
      api.get<ApiResponse<ClusterJobRequestItemModel[]>>(
        apiUrl('company', companyPaths.clusterGetAll),
        {},
        {},
        silent,
      ),
    ),

  createClusterProject: (
    payload: CreateMeshClusterPayload,
  ): Promise<ApiResponse<CreateMeshClusterModel>> =>
    unwrap(
      api.post<ApiResponse<CreateMeshClusterModel>>(
        apiUrl('company', companyPaths.clusterCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};

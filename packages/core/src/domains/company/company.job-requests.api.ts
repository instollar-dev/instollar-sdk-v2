import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { companyPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  CreateJobRequestPayload,
  CreateJobRequestResultModel,
  JobRequestActionResultModel,
} from './job-requests.types';

export const companyJobRequestsApi = {
  completeOrCancelJobRequest: (
    id: string,
    status: string,
    payload?: Record<string, unknown>,
  ): Promise<ApiResponse<JobRequestActionResultModel>> =>
    unwrap(
      api.patch<ApiResponse<JobRequestActionResultModel>>(
        apiUrl('company', companyPaths.jobRequestCompleteCancel(id, status)),
        payload ?? {},
        {},
        { showSuccessToast: true },
      ),
    ),

  createJobRequest: (
    payload: CreateJobRequestPayload,
  ): Promise<ApiResponse<CreateJobRequestResultModel>> =>
    unwrap(
      api.post<ApiResponse<CreateJobRequestResultModel>>(
        apiUrl('company', companyPaths.jobRequestCreate),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};

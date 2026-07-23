import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { adminPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  RateInstallerPayload,
  SwapWorkflowPayload,
  UpdateInstallationDatePayload,
} from './job-requests.types';
import type { JobRequestModel } from './types';

export const adminJobRequestsApi = {
  markJobRequestAsComplete: (id: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.patch<ApiResponse<null>>(
        apiUrl('admin', adminPaths.markJobComplete(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  updateInstallationDate: (
    id: string,
    payload: UpdateInstallationDatePayload,
  ): Promise<ApiResponse<JobRequestModel>> =>
    unwrap(
      api.patch<ApiResponse<JobRequestModel>>(
        apiUrl('admin', adminPaths.updateInstallationDate(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  cancelJobRequest: (id: string): Promise<ApiResponse<null>> =>
    unwrap(
      api.patch<ApiResponse<null>>(
        apiUrl('admin', adminPaths.cancelJobRequest(id)),
        {},
        {},
        { showSuccessToast: true },
      ),
    ),

  rateInstaller: (
    jobRequestId: string,
    raterType: string,
    payload: RateInstallerPayload,
  ): Promise<ApiResponse<void>> =>
    unwrap(
      api.post<ApiResponse<void>>(
        apiUrl('admin', adminPaths.jobRequestRate(jobRequestId, raterType)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  swapWorkflow: (
    jobRequestId: string,
    payload: SwapWorkflowPayload,
  ): Promise<ApiResponse<JobRequestModel>> =>
    unwrap(
      api.patch<ApiResponse<JobRequestModel>>(
        apiUrl('admin', adminPaths.swapWorkflow(jobRequestId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};

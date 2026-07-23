import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  DecideOnJobRequestPayload,
  UpdateBoqItemsPayload,
  UpdateBoqPayload,
} from './job-requests.types';
import type { InstallerJobRequestModel } from './types';

export const installerJobRequestsApi = {
  decideOnJobRequest: (
    id: string,
    payload: DecideOnJobRequestPayload,
  ): Promise<ApiResponse<InstallerJobRequestModel>> =>
    unwrap(
      api.patch<ApiResponse<InstallerJobRequestModel>>(
        apiUrl('installer', installerPaths.jobRequestAcceptReject(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateBoq: (
    id: string,
    payload: UpdateBoqPayload,
  ): Promise<ApiResponse<InstallerJobRequestModel>> =>
    unwrap(
      api.patch<ApiResponse<InstallerJobRequestModel>>(
        apiUrl('installer', installerPaths.jobRequestUpdateBoq(id)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  updateBoqItems: (
    jobId: string,
    payload: UpdateBoqItemsPayload,
  ): Promise<ApiResponse<InstallerJobRequestModel>> =>
    unwrap(
      api.patch<ApiResponse<InstallerJobRequestModel>>(
        apiUrl('installer', installerPaths.jobRequestUpdateItems(jobId)),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),
};

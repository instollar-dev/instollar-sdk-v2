import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { PaginatedApiResponse, ApiResponse } from '../../core/types';
import type { MiniGridJobRequestModel } from '../company/mini-grid.types';
import type { InstallerJobRequestListParams } from './job-requests.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const installerMiniGridApi = {
  getInstallerMiniGridJobRequests: (
    params?: InstallerJobRequestListParams,
  ): Promise<PaginatedApiResponse<MiniGridJobRequestModel>> =>
    unwrap(
      api.get<PaginatedApiResponse<MiniGridJobRequestModel>>(
        apiUrl('installer', installerPaths.miniGridGetAll),
        params,
        { paramsSerializer: { indexes: null } },
        silent,
      ),
    ),

  getInstallerMiniGridJobRequestDetails: (
    jobId: string,
  ): Promise<ApiResponse<MiniGridJobRequestModel>> =>
    unwrap(
      api.get<ApiResponse<MiniGridJobRequestModel>>(
        apiUrl('installer', installerPaths.miniGridSingle(jobId)),
        {},
        {},
        silent,
      ),
    ),
};

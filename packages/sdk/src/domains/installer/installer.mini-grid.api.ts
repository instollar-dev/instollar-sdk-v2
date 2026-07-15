import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type { MiniGridJobRequestModel } from '../company/mini-grid.types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const installerMiniGridApi = {
  getInstallerMiniGridJobRequests: (): Promise<ApiResponse<MiniGridJobRequestModel[]>> =>
    unwrap(
      api.get<ApiResponse<MiniGridJobRequestModel[]>>(
        apiUrl('installer', installerPaths.miniGridGetAll),
        {},
        {},
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

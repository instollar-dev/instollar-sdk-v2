import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  InstallerEsgDashboardModel,
  ProjectEsgModel,
} from './esg.types';

const silent = { showSuccessToast: false } as const;

export const installerEsgApi = {
  getInstallerEsgDashboard: (): Promise<ApiResponse<InstallerEsgDashboardModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerEsgDashboardModel>>(
        apiUrl('installer', installerPaths.esgInstallerDashboard),
        {},
        {},
        silent,
      ),
    ),

  getProjectEsg: (jobRequestId: string): Promise<ApiResponse<ProjectEsgModel>> =>
    unwrap(
      api.get<ApiResponse<ProjectEsgModel>>(
        apiUrl('installer', installerPaths.esgProject(jobRequestId)),
        {},
        {},
        silent,
      ),
    ),
};

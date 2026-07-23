import api from '../../core/api/api-setup';
import { apiUrl } from '../../core/api/base-urls';
import { basePaths, installerPaths } from '../../core/api/api-endpoints';
import { unwrap } from '../../core/api/request';
import type { ApiResponse } from '../../core/types';
import type {
  InstallerLanguageModel,
  InstallerMyRatingModel,
  InstallerProductsMetadataModel,
  InstallerProfileBadgeModel,
  InstallerSettingsModel,
  UpdateInstallerProfilePayload,
  UpdateInstallerSettingsPayload,
} from './profile.types';
import type { InstallerProfileRecordModel } from './types';

const silent = { showSuccessToast: false, showErrorToast: false } as const;

export const installerProfileApi = {
  updateInstallerProfile: (
    payload: UpdateInstallerProfilePayload,
  ): Promise<ApiResponse<InstallerProfileRecordModel>> =>
    unwrap(
      api.post<ApiResponse<InstallerProfileRecordModel>>(
        apiUrl('installer', installerPaths.update),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getInstallerMyRating: (): Promise<ApiResponse<InstallerMyRatingModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerMyRatingModel>>(
        apiUrl('installer', installerPaths.myRating),
        {},
        {},
        silent,
      ),
    ),

  updateSettings: (
    payload: UpdateInstallerSettingsPayload,
  ): Promise<ApiResponse<InstallerSettingsModel>> =>
    unwrap(
      api.put<ApiResponse<InstallerSettingsModel>>(
        apiUrl('base', basePaths.installerSettings),
        payload,
        {},
        { showSuccessToast: true },
      ),
    ),

  getInstallerLanguages: (): Promise<ApiResponse<InstallerLanguageModel[]>> =>
    unwrap(
      api.get<ApiResponse<InstallerLanguageModel[]>>(
        apiUrl('installer', installerPaths.languages),
        {},
        {},
        silent,
      ),
    ),

  getInstallerProducts: (): Promise<ApiResponse<InstallerProductsMetadataModel>> =>
    unwrap(
      api.get<ApiResponse<InstallerProductsMetadataModel>>(
        apiUrl('installer', installerPaths.products),
        {},
        {},
        silent,
      ),
    ),

  getInstallerBadges: (): Promise<ApiResponse<InstallerProfileBadgeModel[]>> =>
    unwrap(
      api.get<ApiResponse<InstallerProfileBadgeModel[]>>(
        apiUrl('installer', installerPaths.badges),
        {},
        {},
        silent,
      ),
    ),
};

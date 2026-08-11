import type { InstallerOnboardingUpdatePayload } from './onboarding.types';

/** @deprecated Prefer {@link InstallerOnboardingUpdatePayload}. */
export type UpdateInstallerProfilePayload = InstallerOnboardingUpdatePayload & {
  [key: string]: unknown;
};

export interface InstallerMyRatingModel {
  [key: string]: unknown;
}

export interface InstallerSettingsModel {
  [key: string]: unknown;
}

export interface InstallerLanguageModel {
  id: string;
  [key: string]: unknown;
}

export interface InstallerProductsMetadataModel {
  [key: string]: unknown;
}

export interface InstallerProfileBadgeModel {
  id: string;
  [key: string]: unknown;
}

export interface UpdateInstallerSettingsPayload {
  [key: string]: unknown;
}

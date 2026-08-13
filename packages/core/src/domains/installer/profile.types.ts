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

/** Row from `GET /installer/languages`. */
export interface InstallerLanguageModel {
  id: string;
  name: string;
  code: string;
  nativeName?: string | null;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface InstallerProductBrandModel {
  id: string;
  name: string;
}

export type InstallerProductMetadataKey =
  | 'SOLAR_INVERTER_BRAND'
  | 'SOLAR_PANEL_BRAND';

/** Brand lists keyed by product category — `GET /installer/products`. */
export interface InstallerProductsMetadataModel {
  SOLAR_INVERTER_BRAND?: InstallerProductBrandModel[];
  SOLAR_PANEL_BRAND?: InstallerProductBrandModel[];
  [key: string]: InstallerProductBrandModel[] | undefined;
}

export interface InstallerProfileBadgeModel {
  id: string;
  [key: string]: unknown;
}

export interface UpdateInstallerSettingsPayload {
  [key: string]: unknown;
}

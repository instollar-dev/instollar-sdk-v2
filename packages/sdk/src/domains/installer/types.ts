export interface InstallerProfileRecordModel {
  id?: string;
  installerName?: string;
  available?: boolean;
  [key: string]: unknown;
}

export interface InstallerJobRequestModel {
  id: string;
  [key: string]: unknown;
}

export interface ToggleInstallerAvailabilityModel {
  available: boolean;
}

export interface InstallerProfileBundleModel {
  profile: InstallerProfileRecordModel;
  badges: unknown[];
}

export interface AssessmentModel {
  id?: string;
  [key: string]: unknown;
}

/** @deprecated Use InstallerProfileRecordModel */
export type InstallerProfileApiData = InstallerProfileRecordModel;
/** @deprecated Use InstallerProfileBundleModel */
export type InstallerProfileData = InstallerProfileBundleModel;
/** @deprecated Use InstallerJobRequestModel */
export type InstallerJobRequest = InstallerJobRequestModel;
/** @deprecated Use ToggleInstallerAvailabilityModel */
export type ToggleInstallerAvailabilityResponse = ToggleInstallerAvailabilityModel;

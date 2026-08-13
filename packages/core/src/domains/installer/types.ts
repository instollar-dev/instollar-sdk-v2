export interface InstallerProfileRecordModel {
  id?: string;
  installerName?: string;
  available?: boolean;
  /** Pending onboarding step slugs. Empty / absent = complete. */
  onboardingStep?: string[] | null;
  guarantorUrl?: string | null;
  gender?: string | null;
  dob?: string | null;
  country?: string | null;
  countryCode?: string | null;
  currency?: string | null;
  state?: string | null;
  lga?: string | null;
  address?: string | null;
  meansOfId?: string | null;
  idNumber?: string | null;
  language?: string | null;
  assessmentLevel?: string | null;
  experience?: string | null;
  cvUrl?: string[] | null;
  eduCertUrl?: string[] | null;
  trainCertUrl?: string[] | null;
  prevProjectUrl?: string[] | null;
  eduQualUrl?: string | null;
  minCapKva?: number | null;
  maxCapKva?: number | null;
  yoe?: number | null;
  brandUsed?: string[] | null;
  projectType?: string[] | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  occupation?: string | null;
  otherOccupation?: string | null;
  skills?: string[] | null;
  motivation?: string | null;
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

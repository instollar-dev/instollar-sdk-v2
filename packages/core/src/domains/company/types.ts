export interface CompanyProfileModel {
  id?: string;
  companyAvatarUrl?: string | null;
  avatarUrl?: string | null;
  twoFactorEnabled?: boolean;
  twoFactorVerified?: boolean;
  /** Pending onboarding step slugs. Empty / absent = complete. */
  onboardingStep?: string[] | null;
  companyName?: string | null;
  name?: string | null;
  companyType?: string[] | null;
  country?: string | null;
  countryCode?: string | null;
  currency?: string | null;
  state?: string | null;
  lga?: string | null;
  headOfficeAddress?: string | null;
  contactPersonName?: string | null;
  contactPersonEmail?: string | null;
  contactPersonNumber?: string | null;
  licenceNumber?: string | null;
  taxId?: string | null;
  registrationNumber?: string | null;
  documents?: string[] | null;
  latitude?: number | null;
  longitude?: number | null;
  [key: string]: unknown;
}

export interface CompanyJobRequestModel {
  id: string;
  [key: string]: unknown;
}

export interface CompanyUpdateUserPayload {
  companyAvatarUrl?: string;
}

/** @deprecated Use CompanyProfileModel */
export type CompanyProfile = CompanyProfileModel;
/** @deprecated Use CompanyJobRequestModel */
export type CompanyJobRequest = CompanyJobRequestModel;

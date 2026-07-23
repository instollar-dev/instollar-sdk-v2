export interface CompanyProfileModel {
  id?: string;
  companyAvatarUrl?: string | null;
  avatarUrl?: string | null;
  twoFactorEnabled?: boolean;
  twoFactorVerified?: boolean;
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

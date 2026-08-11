export type CompanyType = 'SOLAR' | 'MINI_GRID' | 'MESH_GRID';

/** Backend `CompanyOnboardSteps` slugs (canonical order). */
export const COMPANY_ONBOARD_STEPS = {
  COMPANY_DETAILS: 'COMPANY_DETAILS',
  UPLOAD_DOCUMENTS: 'UPLOAD_DOCUMENTS',
} as const;

export type CompanyOnboardStep =
  (typeof COMPANY_ONBOARD_STEPS)[keyof typeof COMPANY_ONBOARD_STEPS];

/** Canonical step order — first pending step in this list is shown next. */
export const COMPANY_ONBOARD_STEP_ORDER: readonly CompanyOnboardStep[] = [
  COMPANY_ONBOARD_STEPS.COMPANY_DETAILS,
  COMPANY_ONBOARD_STEPS.UPLOAD_DOCUMENTS,
];

/** UI step index for the welcome overview (always shown first on mount / reload). */
export const COMPANY_ONBOARDING_WELCOME_UI_STEP = 0;

export interface CompanyUpdatePayload {
  /** Marks an onboarding step complete when set during onboarding. Omit for profile edits. */
  stepDone?: CompanyOnboardStep;
  avatarUrl?: string;
  companyName?: string;
  name?: string;
  companyType?: CompanyType[];
  country?: string;
  countryCode?: string;
  currency?: string;
  state?: string;
  lga?: string;
  headOfficeAddress?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonNumber?: string;
  licenceNumber?: string;
  registrationNumber?: string;
  documents?: string[];
  latitude?: number | null;
  longitude?: number | null;
}

/** Minimal form shape used by step payload builders (apps may extend). */
export interface CompanyOnboardingFormInput {
  companyType: CompanyType[];
  country: string;
  countryCode: string;
  state: string;
  lga: string;
  companyAddress: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  businessRegistrationNumber: string;
  documents: string[];
  nercLicenseNumber: string;
  latitude?: number | null;
  longitude?: number | null;
}

import type { InstallerExperience } from './experience';

/** Backend `InstallerOnboardSteps` slugs (canonical order). */
export const INSTALLER_ONBOARD_STEPS = {
  PERSONAL_DETAILS: 'PERSONAL_DETAILS',
  EXPERIENCE_LEVEL: 'EXPERIENCE_LEVEL',
  DOCUMENTS: 'DOCUMENTS',
  WORK_EXPERIENCE: 'WORK_EXPERIENCE',
  ASSESSMENT: 'ASSESSMENT',
  GUARANTOR_FORM: 'GUARANTOR_FORM',
} as const;

export type InstallerOnboardStep =
  (typeof INSTALLER_ONBOARD_STEPS)[keyof typeof INSTALLER_ONBOARD_STEPS];

export const INSTALLER_ONBOARD_STEP_ORDER: readonly InstallerOnboardStep[] = [
  INSTALLER_ONBOARD_STEPS.PERSONAL_DETAILS,
  INSTALLER_ONBOARD_STEPS.EXPERIENCE_LEVEL,
  INSTALLER_ONBOARD_STEPS.DOCUMENTS,
  INSTALLER_ONBOARD_STEPS.WORK_EXPERIENCE,
  INSTALLER_ONBOARD_STEPS.ASSESSMENT,
  INSTALLER_ONBOARD_STEPS.GUARANTOR_FORM,
];

export const INSTALLER_ONBOARDING_WELCOME_UI_STEP = 0;

/** Pass threshold for the installer assessment quiz (%). */
export const INSTALLER_ASSESSMENT_PASS_PERCENT = 60;

/** Sentinel for “Other” brand selection in professional details. */
export const INSTALLER_BRAND_OTHERS_VALUE = 'OTHERS';

export interface InstallerOnboardingUpdatePayload {
  stepDone?: InstallerOnboardStep;
  gender?: string;
  dob?: string;
  country?: string;
  countryCode?: string;
  state?: string;
  lga?: string;
  address?: string;
  meansOfId?: string;
  idNumber?: string;
  language?: string;
  assessmentLevel?: string;
  /** Backend `InstallerExperience`: EXPERIENCED | IN_EXPERIENCED */
  experience?: InstallerExperience;
  cvUrl?: string[];
  eduCertUrl?: string[];
  trainCertUrl?: string[];
  prevProjectUrl?: string[];
  eduQualUrl?: string;
  minCapKva?: number;
  maxCapKva?: number;
  yoe?: number;
  brandUsed?: string[];
  projectType?: string[];
  latitude?: number | null;
  longitude?: number | null;
  currency?: string;
  /**
   * Device push token (FCM / APNs / Expo push token string).
   * Apps should POST this after permission + token registration so the
   * backend can deliver remote notifications.
   */
  fcmToken?: string | null;
  /** New-installer work experience (optional until backend always returns them). */
  occupation?: string;
  otherOccupation?: string;
  skills?: string[];
  motivation?: string;
}

/** Minimal form shape used by step payload builders (apps may extend). */
export interface InstallerOnboardingFormInput {
  gender: string;
  dob: string;
  country: string;
  countryCode: string;
  state: string;
  lga: string;
  address: string;
  idType: string;
  idNumber: string;
  language: string;
  latitude?: number | null;
  longitude?: number | null;
  cvUrl: string[];
  eduCertUrl: string[];
  trainCertUrl: string[];
  prevProjectUrl: string[];
  eduQualUrl?: string;
  education?: string;
  minCapKva?: number | '' | string | null;
  maxCapKva?: number | '' | string | null;
  yoe?: number | '' | string | null;
  minCapacity?: number | '' | string | null;
  maxCapacity?: number | '' | string | null;
  experienceYears?: number | '' | string | null;
  brandUsed?: string[];
  brands?: string[];
  brandOther?: string;
  projectType?: string[];
  projectTypes?: string[];
  occupation?: string;
  otherOccupation?: string;
  skills?: string[];
  motivation?: string;
}

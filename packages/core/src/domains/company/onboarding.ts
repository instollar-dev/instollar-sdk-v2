import { COUNTRIES } from '../../core/app/countries';
import { resolveCurrencyFromCountryCode } from '../../utils/currency';
import type { CompanyProfileModel } from './types';
import {
  COMPANY_ONBOARD_STEP_ORDER,
  COMPANY_ONBOARD_STEPS,
  COMPANY_ONBOARDING_WELCOME_UI_STEP,
  type CompanyOnboardStep,
  type CompanyOnboardingFormInput,
  type CompanyType,
  type CompanyUpdatePayload,
} from './onboarding.types';

/** Sort API pending slugs into canonical order; drop unknown values. */
export function normalizePendingOnboardingSteps(
  raw: string[] | null | undefined,
): CompanyOnboardStep[] {
  const set = new Set(raw ?? []);
  return COMPANY_ONBOARD_STEP_ORDER.filter((slug) => set.has(slug));
}

/**
 * Pending onboarding steps still in `onboardingStep`.
 * Completing a step removes its slug from the API list.
 */
export function getPendingOnboardingSteps(
  profile: Pick<CompanyProfileModel, 'onboardingStep'> | null | undefined,
): CompanyOnboardStep[] {
  return normalizePendingOnboardingSteps(profile?.onboardingStep);
}

/** Step is complete when its slug was removed from `onboardingStep`. */
export function isCompanyOnboardStepDone(
  profile: Pick<CompanyProfileModel, 'onboardingStep'> | null | undefined,
  step: CompanyOnboardStep,
): boolean {
  return !getPendingOnboardingSteps(profile).includes(step);
}

export function isCompanyOnboardStepPending(
  profile: Pick<CompanyProfileModel, 'onboardingStep'> | null | undefined,
  step: CompanyOnboardStep,
): boolean {
  return getPendingOnboardingSteps(profile).includes(step);
}

/** First step still pending, in canonical order (next step to show). */
export function getFirstPendingOnboardStep(
  profile: Pick<CompanyProfileModel, 'onboardingStep'> | null | undefined,
): CompanyOnboardStep | null {
  const pending = getPendingOnboardingSteps(profile);
  return pending[0] ?? null;
}

/** Stepper / form UI index: 1 = company details, 2 = upload documents. */
export function getUiStepForSlug(slug: CompanyOnboardStep): number {
  const index = COMPANY_ONBOARD_STEP_ORDER.indexOf(slug);
  return index >= 0 ? index + 1 : 1;
}

export function getSlugForUiStep(uiStep: number): CompanyOnboardStep | null {
  return COMPANY_ONBOARD_STEP_ORDER[uiStep - 1] ?? null;
}

/** First form step to open after the user leaves the welcome overview. */
export function getUiStepAfterWelcome(
  profile: Pick<CompanyProfileModel, 'onboardingStep'> | null | undefined,
): number {
  const firstPending = getFirstPendingOnboardStep(profile);
  if (!firstPending) return COMPANY_ONBOARDING_WELCOME_UI_STEP;
  return getUiStepForSlug(firstPending);
}

export function onboardingProgressPercent(
  profile: Pick<CompanyProfileModel, 'onboardingStep'> | null | undefined,
): number {
  const pendingCount = getPendingOnboardingSteps(profile).length;
  const completed = COMPANY_ONBOARD_STEP_ORDER.length - pendingCount;
  return Math.round((completed / COMPANY_ONBOARD_STEP_ORDER.length) * 100);
}

/** Complete when no pending slugs remain in `onboardingStep`. */
export function isCompanyOnboardingComplete(
  profile: Pick<CompanyProfileModel, 'onboardingStep'> | null | undefined,
): boolean {
  return getPendingOnboardingSteps(profile).length === 0;
}

export function profileToOnboardingFormData(
  profile: CompanyProfileModel | null | undefined,
): Partial<CompanyOnboardingFormInput> {
  if (!profile) return {};
  const countryName = profile.country ?? '';
  const countryCode =
    COUNTRIES.find((c) => c.name === countryName || c.countryCode === countryName)
      ?.countryCode ?? countryName;
  const companyDetailsDone = isCompanyOnboardStepDone(
    profile,
    COMPANY_ONBOARD_STEPS.COMPANY_DETAILS,
  );

  return {
    companyType: (profile.companyType ?? []) as CompanyType[],
    country: countryName,
    countryCode,
    latitude: profile.latitude ?? null,
    longitude: profile.longitude ?? null,
    state: profile.state ?? '',
    lga: profile.lga ?? '',
    companyAddress: profile.headOfficeAddress ?? '',
    contactPersonName: companyDetailsDone ? (profile.contactPersonName ?? '') : '',
    contactPersonEmail: companyDetailsDone
      ? (profile.contactPersonEmail ?? '')
      : '',
    contactPersonPhone: companyDetailsDone
      ? (profile.contactPersonNumber ?? '')
      : '',
    businessRegistrationNumber: profile.registrationNumber ?? '',
    documents: [...(profile.documents ?? [])],
    nercLicenseNumber: profile.licenceNumber ?? profile.taxId ?? '',
  };
}

export function buildCompanyDetailsStepPayload(
  formData: CompanyOnboardingFormInput,
): CompanyUpdatePayload {
  return {
    stepDone: COMPANY_ONBOARD_STEPS.COMPANY_DETAILS,
    companyType: formData.companyType,
    country: formData.country,
    countryCode: formData.countryCode,
    currency: resolveCurrencyFromCountryCode(formData.countryCode),
    state: formData.state,
    lga: formData.lga,
    headOfficeAddress: formData.companyAddress,
    contactPersonName: formData.contactPersonName,
    contactPersonEmail: formData.contactPersonEmail,
    contactPersonNumber: formData.contactPersonPhone,
    latitude: formData.latitude,
    longitude: formData.longitude,
  };
}

export function buildUploadDocumentsStepPayload(
  formData: CompanyOnboardingFormInput,
): CompanyUpdatePayload {
  return {
    stepDone: COMPANY_ONBOARD_STEPS.UPLOAD_DOCUMENTS,
    companyType: formData.companyType,
    licenceNumber: formData.nercLicenseNumber,
    registrationNumber: formData.businessRegistrationNumber,
    documents: formData.documents,
  };
}

/** @deprecated Use {@link normalizePendingOnboardingSteps} */
export const normalizeOnboardingSteps = normalizePendingOnboardingSteps;

/** @deprecated Use {@link getFirstPendingOnboardStep} */
export const getFirstIncompleteOnboardStep = getFirstPendingOnboardStep;
